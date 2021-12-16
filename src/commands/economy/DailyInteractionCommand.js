const moment = require('moment');

const { InteractionCommand } = require('../../');
module.exports = class CometsInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'daily',
			description: 'Receba seu premio diario',
			category: 'economy',
			defaultPermission: false,
			devsOnly: true,
			cooldown: 5,
			clientPermissions: ['EMBED_LINKS'],
		});
	}

	async run(ctx) {
		if (parseInt(ctx.data.author.timeDaily) > Date.now()) {
			return ctx.interaction.reply({
				content: ctx.t('commands:daily.getted', { getagain: moment.utc(Date.now() + Number(ctx.data.author.timeDaily)).format('D[d], H[h], m[m], s[s]') }), ephemeral: true });
		}

		ctx.interaction.reply({
			content: ctx.t('commands:daily.get', { user: ctx.data.author.id }), ephemeral: false });

	}
};
