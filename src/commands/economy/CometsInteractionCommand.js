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
					usage: '/comets @Jeremias',
					required: false,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const user = ctx.data.user ?? ctx.data.author;

		if (ctx.data.user) {
			const mentionUser = ctx.options.getUser('usuário', false);

			ctx.makeMessage({
				content: ctx.locale('commands:atm.current.other', { user: mentionUser.toString(), current: user.profile.comets.toLocaleString('pt-BR', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}),
				}),
			});
			return;
		}
		ctx.makeMessage({
			content: ctx.locale('commands:atm.current.me', { current: user.profile.comets.toLocaleString('pt-BR', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}),
			}),
		});
	}
};
