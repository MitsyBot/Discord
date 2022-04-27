const moment = require('moment');
const { InteractionCommand, MitsyEmbed } = require('../../../');
module.exports = class BotInfoInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'status',
			description: 'Mostra o status do bot',
			category: 'info',
			cooldown: 5,
		});
	}

	async run(ctx) {
		const owner = await ctx.client.users.fetch(process.env.OWNER);
		if (ctx.data.guild.lang === 'pt-BR') {
			moment.locale('pt-br');
		}
		else {moment.locale('en-us');}
		if (!ctx.client.shard) return;

		if (!(await ctx.client.ShardingEnded())) {
			ctx.makeMessage({
				content: ctx.locale('errors:sharding_in_progress'),
			});
			return;
		}

		const promises = [
			ctx.client.shard.fetchClientValues('guilds.cache.size'),
			ctx.client.shard.fetchClientValues('users.cache.size'),
		];
		const getReduced = (arr) => arr.reduce((p, c) => p + c, 0);

		const [AllGuilds, AllUsers] = (await Promise.all(promises));

		const embed = new MitsyEmbed()
			.setDescription(
				ctx.locale('commands:botinfo.embed_description', {
					guilds: getReduced(AllGuilds),
					users: getReduced(AllUsers),
					joinedAt: moment.utc(ctx.client.user.createdAt).format('LLLL'),
					uptime: moment.duration(ctx.client.uptime).format('D[d], H[h], m[m], s[s]'),
				}),
			)
			.setFooter(
				ctx.locale('commands:botinfo.embed_footer'),
				owner.displayAvatarURL({
					format: 'png',
					dynamic: true,
				}));

		await ctx.makeMessage({ embeds: [embed] });
	}
};