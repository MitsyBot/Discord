const { InteractionCommand, MiscUtils } = require('../../');
const { MessageButton } = require('discord.js');

module.exports = class CometsInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'pay',
			description: 'Transfira cometinhas para outro usuario',
			category: 'economy',
			options: [
				{
					type: 'USER',
					name: 'usuário',
					description: 'Usuario que deseja transferir os cometinhas',
					required: true,
				},
				{
					name: 'valor',
					description: 'A quantidade para transferir',
					type: 'INTEGER',
					required: true,
					minValue: 1,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const [toSendUser, input] = [
			ctx.options.getUser('usuário', true),
			ctx.options.getInteger('valor', true),
		];
		if (toSendUser.id === ctx.author.id) return ctx.makeMessage({ content: ctx.locale('commands:pay.self-mention'), ephemeral: true });

		if (input < 1) return ctx.makeMessage({ content: ctx.locale('commands:pay.invalid-value'), ephemeral: true });

		if (ctx.client.commandExecutions.has(toSendUser.id)) {
			await ctx.makeMessage({
				content: ctx.locale('errors:economy_usage'),
				ephemeral: true,
			});
			return;
		}

		if (await ctx.client.controllers.developer.blacklisted(toSendUser.id)) {
			await ctx.makeMessage({
				content: ctx.locale('commands:pay.banned-user'),
				ephemeral: true,
			});
			return;
		}


		if (!toSendUser.bot) {
			const confirmButton = new MessageButton()
				.setCustomId(`${ctx.interaction.id} | ACCEPT`)
				.setStyle('SUCCESS')
				.setLabel(ctx.locale('common:accept'));

			const negateButton = new MessageButton()
				.setCustomId(`${ctx.interaction.id} | NEGATE`)
				.setStyle('DANGER')
				.setLabel(ctx.locale('common:negate'));

			ctx.client.commandExecutions.add(toSendUser.id);

			await ctx.makeMessage({
				content: ctx.locale('commands:pay.confirm', {
					user: toSendUser.toString(),
					author: ctx.author.toString(),
					count: input,
				}),
				components: [{ type: 'ACTION_ROW', components: [confirmButton, negateButton] }],
			});

			const selectedButton = await MiscUtils.collectComponentInteractionWithStartingId(
				ctx.channel,
				toSendUser.id,
				ctx.interaction.id,
			);

			ctx.client.commandExecutions.delete(toSendUser.id);

			if (!selectedButton) {
				ctx.makeMessage({
					components: [
						{
							type: 'ACTION_ROW',
							components: MiscUtils.disableComponents(ctx.locale('common:timesup'), [
								confirmButton,
								negateButton,
							]),
						},
					],
				});
				return;
			}

			if (MiscUtils.resolveCustomId(selectedButton.customId) === 'NEGATE') {
				ctx.makeMessage({
					content: ctx.locale('commands:pay.negated', { user: toSendUser.toString() }),
					components: [
						{
							type: 'ACTION_ROW',
							components: [
								confirmButton.setDisabled(true).setStyle('SECONDARY'),
								negateButton.setDisabled(true),
							],
						},
					],
				});
				return;
			}
		}

		if (input > ctx.data.user.comets) {
			ctx.deleteReply();
			ctx.send({
				content: ctx.locale('commands:pay.poor'),
			});
		}


		await this.client.controllers.economy.transfer(ctx.author.id, toSendUser.id, input);


		ctx.makeMessage({
			components: [],
			content: ctx.locale('commands:pay.transfered', {
				input,
				user: toSendUser.toString(),
			}),
		});
	}
};
