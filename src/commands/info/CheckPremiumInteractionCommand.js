const { InteractionCommand, Emotes } = require('../../');
module.exports = class IsPremiumInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'verificarpremium',
			description: 'Verifique se um usuario é premium.',
			category: 'info',
			cooldown: 5,
		});
	}

	async run(ctx) {
		const user = ctx.data.user ?? ctx.data.author;

		if (user.isPremium) {
			await ctx.makeMessage({ content: ctx.t('commands:checkpremium.ispremium', { user: ctx.data.author.id, tier: ctx.data.user.premiumLevel, mitsy_rica: Emotes.MITSY_RICA }), ephemeral: false });
		}
		else {
			await ctx.makeMessage({ content: ctx.t('commands:checkpremium.notpremium', { user: ctx.data.author.id }), ephemeral: false });
		}
	}
};
