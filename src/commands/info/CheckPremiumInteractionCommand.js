const { InteractionCommand, Emotes } = require('../../');
module.exports = class IsPremiumInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'verificarpremium',
			options: [
				{
					name: 'usuário',
					type: 'USER',
					description: 'Mencione um usuário',
					required: false,
				},
			],
			description: 'Verifique se um usuario é premium.',
			category: 'info',
			cooldown: 5,
		});
	}

	async run(ctx) {
		const user = ctx.data.user ?? ctx.data.author;
		const mentionUser = ctx.options.getUser('usuário', false) ?? `<@${ctx.author.id}>`;

		if (user.isPremium) {
			await ctx.makeMessage({ content: ctx.locale('commands:checkpremium.ispremium', { user: mentionUser.toString(), tier: user.premiumLevel, mitsy_rica: Emotes.MITSY_RICA }), ephemeral: false });
		}
		else {
			await ctx.makeMessage({ content: ctx.locale('commands:checkpremium.notpremium', { user: mentionUser.toString() }), ephemeral: false });
		}
	}
};
