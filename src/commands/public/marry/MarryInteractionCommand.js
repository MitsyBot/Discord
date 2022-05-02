const { InteractionCommand, Util } = require('../../../');
const { MessageButton } = require('discord.js');

module.exports = class MarryInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'marry',
			description: 'Case com alguém que voce ama.',
			category: 'marry',
			options: [
				{
					type: 'USER',
					name: 'user',
					description: 'A pessoa que voce quer casar',
					required: true,
					usage: '/marry Steve',
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const authorData = ctx.data.author;
		const mencionado = ctx.options.getUser('user', true);


		if (mencionado.bot) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('MITSY_STOP', 'commands:casar.bot'),
				ephemeral: true,
			});
			return;
		}
		if (mencionado.id === ctx.author.id) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('MITSY_STOP', 'commands:casar.self-mention'),
				ephemeral: true,
			});
			return;
		}

		if (authorData.profile.married) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('MITSY_STOP', 'commands:casar.married'),
				ephemeral: true,
			});
			return;
		}

		const user2 = await ctx.client.database.user.ensureUserInfos(mencionado.id);
		console.log(user2);
		if (!user2) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('MITSY_POINT', 'commands:casar.no-dbuser'),
				ephemeral: true,
			});
			return;
		}

		if (user2.ban === true) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('MITSY_STOP', 'commands:casar.banned-user'),
				ephemeral: true,
			});
			return;
		}

		if (user2.profile.married) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('MITSY_STOP', 'commands:casar.mention-married'),
				ephemeral: true,
			});
			return;
		}

		const ConfirmButton = new MessageButton()
			.setCustomId(`${ctx.interaction.id} CONFIRM`)
			.setLabel(ctx.locale('commands:casar.accept'))
			.setStyle('SUCCESS');

		const CancellButton = new MessageButton()
			.setCustomId(`${ctx.interaction.id} CANCEL`)
			.setLabel(ctx.locale('commands:casar.deny'))
			.setStyle('DANGER');

		ctx.makeMessage({
			content: ctx.locale('commands:casar.first-text', {
				author: ctx.author.toString(),
				toMarry: mencionado.toString(),
			}),
			components: [{ type: 1, components: [ConfirmButton, CancellButton] }],
		});

		const filter = (int) =>
			int.customId.startsWith(ctx.interaction.id) && int.user.id === mencionado.id;

		const collected = await Util.collectComponentInteractionWithCustomFilter(
			ctx.channel,
			filter,
			30000,
		);

		if (!collected) {
			ctx.makeMessage({
				components: [
					{
						type: 1,
						components: [
							ConfirmButton.setDisabled(true).setStyle('SECONDARY'),
							CancellButton.setDisabled(true).setStyle('SECONDARY'),
						],
					},
				],
			});
			return;
		}

		if (collected.customId.endsWith('CANCEL')) {
			ctx.makeMessage({
				content: `<:mitsy_bugada:914596410303844392> | ${ctx.locale('commands:casar.negated', {
					toMarry: mencionado.toString(),
					author: ctx.author.toString(),
				})}`,
				components: [
					{
						type: 1,
						components: [
							ConfirmButton.setDisabled(true).setStyle('SECONDARY'),
							CancellButton.setDisabled(true).setStyle('PRIMARY'),
						],
					},
				],
			});
			return;
		}

		ctx.makeMessage({
			content: `💍 | ${ctx.locale('commands:casar.accepted', {
				toMarry: mencionado.toString(),
				author: ctx.author.toString(),
			})}`,
			components: [
				{
					type: 1,
					components: [
						ConfirmButton.setDisabled(true).setStyle('PRIMARY'),
						CancellButton.setDisabled(true).setStyle('SECONDARY'),
					],
				},
			],
		});

		await ctx.client.database.user.profiles.update({
			where: {
				id: ctx.author.id,
			},
			data: {
				married: true,
				married_user: mencionado.id,
				married_since: Date.now(),
			},
		});

		await ctx.client.database.user.profiles.update({
			where: {
				id: mencionado.id,
			},
			data: {
				married: true,
				married_user: ctx.author.id,
				married_since: Date.now(),
			},
		});
	}
};