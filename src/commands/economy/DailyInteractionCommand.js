const moment = require('moment');
require('moment-duration-format');
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
		if (parseInt(ctx.data.author.timeDaily) > Date.now()) {
			return ctx.makeMessage({
				content: ctx.locale('commands:daily.getted', { getagain: moment.utc(Number(ctx.data.author.timeDaily) - Date.now()).format('D [D], H [h], m [m], s [s]') }), ephemeral: true });
		}

		ctx.makeMessage({
			content: ctx.locale('commands:daily.get', { user: ctx.author.id }), ephemeral: false });

	}
};
