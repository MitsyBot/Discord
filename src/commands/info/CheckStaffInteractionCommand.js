const { InteractionCommand, Emotes } = require('../../');
module.exports = class IsStaffInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'verificarequipe',
			options: [
				{
					name: 'usuário',
					type: 'USER',
					description: 'Mencione um usuário',
					required: false,
				},
			],
			description: 'Verifique se um usuario é membro da equipe da mitsy da mitsy.',
			category: 'info',
			cooldown: 5,
		});
	}

	async run(ctx) {
		const user = ctx.data.user ?? ctx.data.author;
		const mentionUser = ctx.options.getUser('usuário', false) ?? `<@${ctx.author.id}>`;


		let staffLevel;

		switch (user.staffLevel) {
		case 1:
			staffLevel = 'Designer';
			break;
		case 2:
			staffLevel = 'do Suporte da Mitsy';
			break;
		case 3:
			staffLevel = 'o Desenvolvedor';
			break;
		case 4:
			staffLevel = 'o Criador da Mitsy';
			break;
		}

		if (user.isStaff) {
			await ctx.makeMessage({ content: ctx.locale('commands:checkstaff.isstaff', { user: mentionUser.toString(), mitsy_happy: Emotes.MITSY_HAPPY, level: staffLevel }), ephemeral: false });
		}
		else {
			await ctx.makeMessage({ content: ctx.locale('commands:checkstaff.notstaff', { user: mentionUser.toString() }), ephemeral: false });
		}
	}
};
