const { InteractionCommand } = require('../../../');
const moment = require('moment');

module.exports = class LevelInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'rep',
			description: 'Envie uma reputação para um usuário.',
			category: 'social',
			options: [
				{
					name: 'usuário',
					type: 'USER',
					usage: '/rep Duuuuardo',
					description: 'Mencione um usuário',
					required: true,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const author_db = ctx.data.author;
		const member = ctx.options.getUser('usuário');
		const author = ctx.author;
		if (!member) {
			await ctx.makeMessage({ content: ctx.prettyResponse('error', 'commands:rep.noUser') });
			return;
		}

		if (member.id === author.id) {
			await ctx.makeMessage({ content: ctx.prettyResponse('error', 'commands:rep.self') });
			return;
		}
		const REP_INTERVAL = 12 * 60 * 60 * 1000;

		if (Date.now() - author_db.cooldowns.last_rep < REP_INTERVAL) {
			return ctx.makeMessage({
				content: ctx.locale('commands:rep.getted', { repagain: moment.duration(REP_INTERVAL - (Date.now() - author_db.cooldowns.last_rep)).format('h[h] m[m] s[s]') }), ephemeral: true });
		}

		ctx.makeMessage({ content: ctx.prettyResponse('MITSY_OK', 'commands:rep.link', { user: member.id, author: author.id, channel: ctx.interaction.channel.id, guild: ctx.interaction.guild.id }) });
	}
};
