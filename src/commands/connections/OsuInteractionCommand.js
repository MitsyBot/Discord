const { InteractionCommand, MitsyEmbed, MiscUtils } = require('../../');
const moment = require('moment');

module.exports = class OsuInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'osu',
			description: 'Veja os comandos relacionados a osu.',
			category: 'connections',
			options: [
				{
					name: 'player',
					description: 'Veja os status de um player',
					type: 'SUB_COMMAND',
				},
			],
			cooldown: 5,
		});
	}


	async run(ctx) {
		const option = ctx.options.getSubcommand();

		if (!option) return OsuInteractionCommand.player(ctx);

		if (option === 'player') return OsuInteractionCommand.player(ctx);

	}

	static async player(ctx) {
		const user = ctx.data.author;
		const connections = await ctx.client.controllers.connection.getConnectionsFiltered(user.id);
		const osu = connections.find(c => c.name === 'osu');
		if (!osu.account) {
			ctx.makeMessage({ content: ctx.locale('commands:osu.subcommands.player.noPlayer') });
		}
		let osuUser;
		if (!osuUser && osu.account) osuUser = osu.account.id;
		const userData = await ctx.client.apis.osu.getUser(osuUser, 'osu');

		const mitsyembed = new MitsyEmbed(user)
			.setAuthor('Osu', 'https://i.imgur.com/Ek0hnam.png')
			.setColor('#ffff')
			.setThumbnail(`https://a.ppy.sh/${userData.user_id}?${Date.now()}.png`)
			.setDescriptionFromBlockArray([
				[
					`:flag_${userData.country.toLowerCase()}: **[${userData.username}](https://osu.ppy.sh/u/${userData.user_id})** (${ctx.locale('commands:osu.subcommands.player.level', { number: MiscUtils.formatNumber(Math.floor(userData.level), ctx.data.guild.lang) })})`,
				],
				[
					ctx.locale('commands:osu.subcommands.player.joinedAt', { date: moment(userData.join_date).format('LLL'), timeAgo: moment(userData.join_date).fromNow() }),
					ctx.locale('commands:osu.subcommands.player.playTime', { time: moment.duration(userData.total_seconds_played * 1000).format('d[d] h[h] m[m] s[s]'), pp: MiscUtils.formatNumber(Math.floor(userData.pp_raw), ctx.data.guild.lang) }),
				],
				[
					`**${MiscUtils.formatNumber(userData.count_rank_ssh, ctx.data.guild.lang)}**, **${MiscUtils.formatNumber(userData.count_rank_ss, ctx.data.guild.lang)}**, **${MiscUtils.formatNumber(userData.count_rank_sh, ctx.data.guild.lang)}**, **${MiscUtils.formatNumber(userData.count_rank_s, ctx.data.guild.lang)}**, **${MiscUtils.formatNumber(userData.count_rank_a, ctx.data.guild.lang)}**`,
				],
				[
					ctx.locale('commands:osu.subcommands.player.globalRanking', { rank: MiscUtils.formatNumber(userData.pp_rank, ctx.data.guild.lang) }),
					ctx.locale('commands:osu.subcommands.player.countryRanking', { rank: MiscUtils.formatNumber(userData.pp_country_rank, ctx.data.guild.lang) }),
					ctx.locale('commands:osu.subcommands.player.rankedScore', { rankedScore: MiscUtils.formatNumber(userData.ranked_score, ctx.data.guild.lang) }),
					ctx.locale('commands:osu.subcommands.player.totalScore', { totalScore: MiscUtils.formatNumber(userData.total_score, ctx.data.guild.lang) }),
				],
				[
					ctx.locale('commands:osu.subcommands.player.hitAccuracy', { accuracy: Math.floor(userData.accuracy) }),
					ctx.locale('commands:osu.subcommands.player.playCount', { playCount: MiscUtils.formatNumber(userData.playcount, ctx.data.guild.lang) }),
					ctx.locale('commands:osu.subcommands.player.totalHits', { totalHits: MiscUtils.formatNumber((parseInt(userData.count300) + parseInt(userData.count100) + parseInt(userData.count50)), ctx.data.guild.lang), 300: MiscUtils.formatNumber(userData.count300, ctx.data.guild.lang), 100: MiscUtils.formatNumber(userData.count100, ctx.data.guild.lang), 50: MiscUtils.formatNumber(userData.count50, ctx.data.guild.lang) }),
				],
			]);

		ctx.makeMessage({ embed: mitsyembed });
	}
};
