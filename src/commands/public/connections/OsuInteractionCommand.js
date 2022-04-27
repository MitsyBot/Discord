const { InteractionCommand, MitsyEmbed, MiscUtils, Emotes } = require('../../../');
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
					type: 'SUB_COMMAND_GROUP',
					options: [
						{
							name: 'infos',
							description: 'Veja informações sobre um perfil de osu',
							type: 'SUB_COMMAND',
							options: [
								{
									type: 'USER',
									name: 'usuário',
									description: 'Usuario que deseja ver o perfil de osu (opcional)',
									required: false,
								},
							],
						},
						{
							name: 'top',
							description: 'Veja informações sobre o topscore de um usuario',
							type: 'SUB_COMMAND',
							options: [
								{
									type: 'USER',
									name: 'usuário',
									description: 'Usuario que deseja ver o topscore de osu (opcional)',
									required: false,
								},
							],
						},
						{
							name: 'recent',
							description: 'Veja informações sobre as plays recentes de um usuario',
							type: 'SUB_COMMAND',
							options: [
								{
									type: 'USER',
									name: 'usuário',
									description: 'Usuario que deseja ver as plays recentes de osu (opcional)',
									required: false,
								},
							],
						},
					],
				},
			],
			cooldown: 5,
		});
	}


	async run(ctx) {
		const type = ctx.options.getSubcommandGroup(false);

		if (!type) return OsuInteractionCommand.player(ctx);

		if (type === 'player') {
			const option = ctx.options.getSubcommand();

			if (option === 'infos') return OsuInteractionCommand.playerGeneral(ctx);
			if (option === 'top') return OsuInteractionCommand.playerTopScore(ctx);
			if (option === 'recent') return OsuInteractionCommand.playerRecentPlays(ctx);

		}
	}

	static async playerGeneral(ctx) {
		moment.locale(ctx.data.guild.lang);
		const user = ctx.data.user ?? ctx.data.author;
		const connections = await ctx.client.controllers.connection.getConnectionsFiltered(user.id);
		const osu = connections.find(c => c.name === 'osu');
		if (!osu.account) {
			return ctx.makeMessage({ content: ctx.locale('commands:osu.subcommands.player.noPlayer') });
		}
		let osuUser;
		if (!osuUser && osu.account) osuUser = osu.account.id;
		const userData = await ctx.client.apis.osu.getUser(osuUser, 'osu');

		const embed = new MitsyEmbed(user)
			.setAuthor('Osu', 'https://i.imgur.com/Ek0hnam.png')
			.setColor('#E7669F')
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
					`**<:xh:943943260496351252> ${MiscUtils.formatNumber(userData.count_rank_ssh, ctx.data.guild.lang)}**, <:x_:943943260420849674> **${MiscUtils.formatNumber(userData.count_rank_ss, ctx.data.guild.lang)}**, <:sh:943943260336980009> **${MiscUtils.formatNumber(userData.count_rank_sh, ctx.data.guild.lang)}**, <:s_:943943260706066482> **${MiscUtils.formatNumber(userData.count_rank_s, ctx.data.guild.lang)}**, <:a_:943943921212465174> **${MiscUtils.formatNumber(userData.count_rank_a, ctx.data.guild.lang)}**`,
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

		ctx.makeMessage({ embeds: [embed] });
	}

	static async playerTopScore(ctx) {
		moment.locale(ctx.data.guild.lang);
		const user = ctx.data.user ?? ctx.data.author;
		const connections = await ctx.client.controllers.connection.getConnectionsFiltered(user.id);
		const osu = connections.find(c => c.name === 'osu');
		if (!osu.account) {
			return ctx.makeMessage({ content: ctx.locale('commands:osu.subcommands.player.noPlayer') });
		}
		let osuUser;
		if (!osuUser && osu.account) osuUser = osu.account.id;
		const userData = await ctx.client.apis.osu.getUser(osuUser, 'osu');

		const topScores = await ctx.client.apis.osu.getUserTopScores(osuUser, 'osu', 5);
		if (topScores.length > 0) {
			const description = [];

			for (const i in topScores) {
				const [firstBeatmap] = await ctx.client.apis.osu.getBeatmap(topScores[i].beatmap_id, 'osu');
				if (firstBeatmap) description.push(`#${parseInt(i) + 1} - **[${firstBeatmap.artist} - ${firstBeatmap.title} (${firstBeatmap.version})](https://osu.ppy.sh/b/${topScores[i].beatmap_id})** ${Emotes.getOsuEmoji(topScores[i].rank.length === 1 ? `${topScores[i].rank.toLowerCase()}_` : topScores[i].rank.toLowerCase())} - **${MiscUtils.formatNumber(parseInt(topScores[i].pp), ctx.data.guild.lang)}pp**`);
			}

			const embed = new MitsyEmbed(user)
				.setAuthor('Osu', 'https://i.imgur.com/Ek0hnam.png')
				.setColor('#E7669F')
				.setDescriptionFromBlockArray([
					[
						ctx.locale('commands:osu.subcommands.player.topScores', { user: userData.username }),
					],
					[
						description.join('\n'),
					],
				]);
			ctx.makeMessage({ embeds: [embed] });

		}
		else {
			ctx.makeMessage({ content: ctx.locale('commands:osu.subcommands.player.NothingtopScores', { user: userData.username }) });

		}
	}

	static async playerRecentPlays(ctx) {
		moment.locale(ctx.data.guild.lang);
		const user = ctx.data.user ?? ctx.data.author;
		const connections = await ctx.client.controllers.connection.getConnectionsFiltered(user.id);
		const osu = connections.find(c => c.name === 'osu');
		if (!osu.account) {
			return ctx.makeMessage({ content: ctx.locale('commands:osu.subcommands.player.noPlayer') });
		}
		let osuUser;
		if (!osuUser && osu.account) osuUser = osu.account.id;
		const userData = await ctx.client.apis.osu.getUser(osuUser, 'osu');
		const recentPlays = await ctx.client.apis.osu.getUserRecentPlays(userData, 'osu', 5);
		if (recentPlays.length > 0) {
			const description = [];

			for (const int in recentPlays) {
				const [firstBeatmap] = await ctx.client.apis.osu.getBeatmap(recentPlays[int].beatmap_id, 'osu');
				if (firstBeatmap) description.push(`#${parseInt(int) + 1} - **[${firstBeatmap.artist} - ${firstBeatmap.title} (${firstBeatmap.version})](https://osu.ppy.sh/b/${recentPlays[int].beatmap_id})** ${Emotes.getOsuEmoji(recentPlays[int].rank.length === 1 ? `${recentPlays[int].rank.toLowerCase()}_` : recentPlays[int].rank.toLowerCase())} (${moment(recentPlays[int].date).fromNow()})`);
			}

			const embed = new MitsyEmbed(user)
				.setAuthor('Osu', 'https://i.imgur.com/Ek0hnam.png')
				.setColor('#E7669F')
				.setDescriptionFromBlockArray([
					[
						ctx.locale('commands:osu.subcommands.player.recentPlays', { user: userData.username }),
					],
					[
						description.join('\n'),
					],
				]);
			ctx.makeMessage({ embeds: [embed] });
		}
		else {
			ctx.makeMessage({ content: ctx.locale('commands:osu.subcommands.player.NothingRecentPlays', { user: userData.username }) });
		}
	}
};
