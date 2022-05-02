const { InteractionCommand, MitsyEmbed } = require('../../../');
module.exports = class StatsInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'stats',
			description: 'Veja as estatisticas de apostas dos usuarios.',
			options: [
				{
					name: 'bicho',
					type: 'SUB_COMMAND',
					description: 'Veja os estatísticas de jogo do bicho de alguém',
					options: [
						{
							name: 'user',
							description: 'Usuário para ver os status',
							type: 'USER',
							required: false,
						},
					],
				},
				{
					name: 'roleta',
					type: 'SUB_COMMAND',
					description: 'Veja as estatísticas de roleta de alguém',
					options: [
						{
							name: 'user',
							description: 'Usuário para ver os status',
							type: 'USER',
							required: false,
						},
					],
				},
				{
					name: 'coinflip',
					description: 'Veja as estatísticas de coinflip de alguém',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'user',
							description: 'Usuário para ver os status',
							type: 'USER',
							required: false,
						},
					],
				},
			],
			category: 'info',
			cooldown: 5,
		});
	}

	async run(ctx) {
		const command = ctx.options.getSubcommand();

		switch (command) {
		case 'coinflip':
			return StatsInteractionCommand.CoinflipStatus(ctx);
		case 'roleta':
			return StatsInteractionCommand.RouletteStatus(ctx);
		case 'bicho':
			return StatsInteractionCommand.BichoStatus(ctx);
		}
	}

	static makeGameStatisticsEmbed(data, translate, type, userTag) {
		const totalMoney = data.winMoney - data.lostMoney;

		const embed = new MitsyEmbed()
			.setTitle(translate(`commands:status.${type}.embed-title`, { user: userTag }))
			.addFields([
				{
					name: `🎰 | ${translate('commands:status.coinflip.played')}`,
					value: `**${data.playedGames}**`,
					inline: true,
				},
				{
					name: `🏆 | ${translate('commands:status.coinflip.wins')}`,
					value: `**${data.winGames}** | (${data.winPorcentage}) **%**`,
					inline: true,
				},
				{
					name: `<:MITSY_RICA:872870327049396274> | ${translate('commands:status.coinflip.loses')}`,
					value: `**${data.lostGames}** | (${data.lostPorcentage}) **%**`,
					inline: true,
				},
				{
					name: `📥 | ${translate('commands:status.coinflip.earnMoney')}`,
					value: `**${data.winMoney}**`,
					inline: true,
				},
				{
					name: `📤 | ${translate('commands:status.coinflip.lostMoney')}`,
					value: `**${data.lostMoney}**`,
					inline: true,
				},
			]);
		// eslint-disable-next-line no-unused-expressions
		totalMoney > 0
			? embed.addField(
				`<:mitsy_yes:853638770107482163> | ${translate('commands:status.coinflip.profit')}`,
				`**${totalMoney}**`,
				true,
			)
			: embed.addField(
				`<:mitsy_no:853638580139720714> | ${translate('commands:status.coinflip.loss')}`,
				`**${totalMoney}**`,
				true,
			);

		return embed;
	}

	static async BichoStatus(ctx) {
		const user = ctx.options.getUser('user') ?? ctx.author;

		const wonGames = await ctx.client.database.transactions.findMany({
			where: {
				received_by: user.id,
				reason: 'BICHO',
			},
		});

		const loseGames = await ctx.client.database.transactions.findMany({
			where: {
				given_by: user.id,
				reason: 'BICHO',
			},
		});

		const playedGames = wonGames.length + loseGames.length;

		const lostGames = loseGames.length;
		const winGames = wonGames.length;
		const winPorcentage = ((winGames / playedGames) * 100).toFixed(2) || 0;
		const lostPorcentage = ((lostGames / playedGames) * 100).toFixed(2) || 0;

		if (playedGames < 1) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:status.roleta.no-data'),
			});
			return;
		}

		const lostMoney = loseGames.reduce((accum, game) => Number(accum) + Number(game.quantity), 0);
		const winMoney = wonGames.reduce((accum, game) => Number(accum) + Number(game.quantity), 0);


		const totalMoney = winMoney - lostMoney;

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:status.bicho.embed-title', { user: user.tag }))
			.addFields([
				{
					name: `🎰 | ${ctx.locale('commands:status.coinflip.played')}`,
					value: `**${playedGames}**`,
					inline: true,
				},
				{
					name: `🏆 | ${ctx.locale('commands:status.coinflip.wins')}`,
					value: `**${winGames}** | (${winPorcentage}) **%**`,
					inline: true,
				},
				{
					name: `<:MITSY_RICA:872870327049396274> | ${ctx.locale('commands:status.coinflip.loses')}`,
					value: `**${lostGames}** | (${lostPorcentage}) **%**`,
					inline: true,
				},
				{
					name: `📥 | ${ctx.locale('commands:status.coinflip.earnMoney')}`,
					value: `**${winMoney}**`,
					inline: true,
				},
				{
					name: `📤 | ${ctx.locale('commands:status.coinflip.lostMoney')}`,
					value: `**${lostMoney}**`,
					inline: true,
				},
			]);
		// eslint-disable-next-line no-unused-expressions
		totalMoney > 0
			? embed.addField(
				`<:mitsy_yes:853638770107482163> | ${ctx.locale('commands:status.coinflip.profit')}`,
				`**${totalMoney}**`,
				true,
			)
			: embed.addField(
				`<:mitsy_no:853638580139720714> | ${ctx.locale('commands:status.coinflip.loss')}`,
				`**${totalMoney}**`,
				true,
			);

		await ctx.makeMessage({ embeds: [embed] });
	}


	static async RouletteStatus(ctx) {
		const user = ctx.options.getUser('user') ?? ctx.author;


		const wonGames = await ctx.client.database.transactions.findMany({
			where: {
				received_by: user.id,
				reason: 'ROULETTE',
			},
		});

		const loseGames = await ctx.client.database.transactions.findMany({
			where: {
				given_by: user.id,
				reason: 'ROULETTE',
			},
		});
		const lostGames = loseGames.length;
		const winGames = wonGames.length;
		const playedGames = lostGames + winGames;
		if (playedGames < 1) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:status.roleta.no-data'),
			});
			return;
		}

		const lostMoney = loseGames.reduce((accum, game) => Number(accum) + Number(game.quantity), 0);
		const winMoney = wonGames.reduce((accum, game) => Number(accum) + Number(game.quantity), 0);

		const winPorcentage = ((winGames / playedGames) * 100).toFixed(2) || 0;
		const lostPorcentage = ((lostGames / playedGames) * 100).toFixed(2) || 0;

		const data = {
			playedGames,
			lostGames,
			winGames,
			winMoney,
			lostMoney,
			winPorcentage,
			lostPorcentage,
		};

		const embed = StatsInteractionCommand.makeGameStatisticsEmbed(data, ctx.i18n, 'roleta', user.tag);

		await ctx.makeMessage({ embeds: [embed] });
	}

	static async CoinflipStatus(ctx) {
		const user = ctx.options.getUser('user') ?? ctx.author;

		const wonGames = await ctx.client.database.transactions.findMany({
			where: {
				received_by: user.id,
				reason: 'COINFLIP',
			},
		});

		const loseGames = await ctx.client.database.transactions.findMany({
			where: {
				given_by: user.id,
				reason: 'COINFLIP',
			},
		});
		const lostGames = loseGames.length;
		const winGames = wonGames.length;
		const playedGames = lostGames + winGames;
		const lostMoney = loseGames.reduce((accum, game) => Number(accum) + Number(game.quantity), 0);
		const winMoney = wonGames.reduce((accum, game) => Number(accum) + Number(game.quantity), 0);


		const winPorcentage = ((winGames / playedGames) * 100).toFixed(2) || 0;
		const lostPorcentage = ((lostGames / playedGames) * 100).toFixed(2) || 0;

		const data = {
			playedGames,
			lostGames,
			winGames,
			winMoney,
			lostMoney,
			winPorcentage,
			lostPorcentage,
		};

		if (data.playedGames < 1) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:status.coinflip.no-data'),
			});
			return;
		}

		const embed = StatsInteractionCommand.makeGameStatisticsEmbed(data, ctx.i18n, 'coinflip', user.tag);

		await ctx.makeMessage({ embeds: [embed] });
	}

};
