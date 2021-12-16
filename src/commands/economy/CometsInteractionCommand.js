const { InteractionCommand } = require('../../');
module.exports = class CometsInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'cometinhas',
			description: 'Veja os seus cometinhas ou os de outro usuario',
			category: 'economy',
			options: [
				{
					type: 'USER',
					name: 'usuário',
					description: 'Usuario que deseja ver os cometinhas (opcional)',
					required: false,
				},
			],
			defaultPermission: false,
			devsOnly: true,
			cooldown: 5,
			clientPermissions: ['EMBED_LINKS'],
		});
	}

	async run(ctx) {
		const user = ctx.data.user ?? ctx.data.author;

		ctx.interaction.reply({
			content: ctx.t('commands:atm.current.me', { current: user.comets.toLocaleString('pt-BR', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}),
			}),
		});
	}
};
