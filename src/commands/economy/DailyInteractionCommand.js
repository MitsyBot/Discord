const { InteractionCommand } = require('../../');
module.exports = class DailyInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'daily',
			description: 'Receba seu premio diario',
			category: 'economy',
			cooldown: 5,
		});
	}

	async run(ctx) {

		try {
			ctx.makeMessage({
				content: ctx.locale('commands:daily.get', { user: ctx.author.id }), ephemeral: false });
		}
		catch (e) {
			switch (e.message) {
			case 'ALREADY_CLAIMED':
				ctx.makeMessage({
					content: ctx.locale('commands:daily.getted', { getagain: e.formattedCooldown }), ephemeral: true });
				break;
			default:
				ctx.makeMessage({
					content: ctx.locale('errors:generic'), ephemeral: true });
			}
		}
	}
};
