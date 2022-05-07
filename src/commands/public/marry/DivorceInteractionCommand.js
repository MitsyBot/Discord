const { InteractionCommand, Util } = require('../../../');
const { MessageButton } = require('discord.js');

module.exports = class DivorceInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'divorce',
			description: 'Seu casamento não está dando certo? então acho melhor divorciar né.',
			category: 'marry',
			cooldown: 8,
		});
	}

	async run(ctx) {
		const authorData = ctx.data.author;

		if (!authorData.profile.married) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('warn', 'commands:divorciar.author-single'),
				ephemeral: true,
			});
			return;
		}

		const ConfirmButton = new MessageButton()
			.setCustomId(`${ctx.interaction.id} CONFIRM`)
			.setLabel(ctx.locale('commands:divorciar.divorce'))
			.setStyle('SUCCESS');

		const CancellButton = new MessageButton()
			.setCustomId(`${ctx.interaction.id} CANCEL`)
			.setLabel(ctx.locale('commands:divorciar.cancel'))
			.setStyle('DANGER');

		ctx.makeMessage({
			content: `<:mitsy_think:834129966299217950> | ${ctx.locale('commands:divorciar.confirmation')} <@${
				authorData.profile.married_user
			}> ?`,
			components: [{ type: 1, components: [ConfirmButton, CancellButton] }],
		});

		const filter = (int) =>
			int.customId.startsWith(ctx.interaction.id) && int.user.id === ctx.author.id;

		const collected = await Util.collectComponentInteractionWithCustomFilter(
			ctx.channel,
			filter,
			15000,
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

		if (collected.customId.endsWith('CONFIRM')) {
			ctx.makeMessage({
				content: `<:mitsy_ok:834129966487699456> | ${ctx.locale('commands:divorciar.confirmed', {
					author: ctx.author.toString(),
					mention: `<@${authorData.profile.married_user}>`,
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
					married: false,
					married_user: undefined,
					married_since: 0,
				},
			});

			await ctx.client.database.user.profiles.update({
				where: {
					id: authorData.married_user,
				},
				data: {
					married: false,
					married_user: undefined,
					married_since: 0,
				},
			});
		}
		else {
			ctx.makeMessage({
				content: `<:mitsy_stop:853642349628227625> | ${ctx.locale('commands:divorciar.canceled')}`,
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
		}
	}
};