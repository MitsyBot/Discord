const moment = require('moment');

const { Console } = require('node:console');
const { Transform } = require('node:stream');
const { InteractionCommand, Emotes, MitsyEmbed, HTTPrequests } = require('../../../');
module.exports = class PingInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'ping',
			description: 'Mostra o ping do bot',
			options: [
				{
					name: 'opções',
					type: 'STRING',
					description: 'Escolha uma dessas opções',
					usage: '/ping shards',
					required: false,
					choices: [
						{
							name: 'shards',
							value: 'shards',
						},
					],
				},
			],
			category: 'info',
			cooldown: 5,
		});
	}

	async run(ctx) {
		if (!ctx.client.shard) return;
		const avatar = ctx.author.displayAvatarURL({ format: 'png', dynamic: true });

		if (ctx.options.getString('opções') === 'shards') {
			if (!(await ctx.client.ShardingEnded())) {
				ctx.makeMessage({
					content: ctx.locale('common:sharding_in_progress'),
				});
				return;
			}
			const promises = [
				ctx.client.shard.fetchClientValues('ws.ping'),
				ctx.client.shard.fetchClientValues('ws.status'),
				ctx.client.shard.fetchClientValues('ws.client.uptime'),
				ctx.client.shard.fetchClientValues('guilds.cache.size'),
				ctx.client.shard.broadcastEval(() => process.memoryUsage().heapUsed),
			];

			const [
				allShardsPing,
				allShardsStatus,
				allShardsUptime,
				guildsPerShardCount,
				allShardsMemoryUsedByProcess,
			] = (await Promise.all(promises));


			const tabled = allShardsPing.reduce(
				(
					p,
					c,
					n,
				) => {
					const conninfo = {
						0: 'READY',
						1: 'CONNECTING',
						2: 'RECONNECTING',
						3: 'IDLE',
						4: 'NEARLY',
						5: 'DISCONNECTED',
						6: 'WAITING_FOR_GUILDS',
						7: 'IDENTIFYING',
						8: 'RESUMING',
					};
					p.push({
						Ping: `${c}ms`,
						Status: conninfo[allShardsStatus[n]],
						Uptime: moment.duration(allShardsUptime[n]).format('D[d], H[h], m[m], s[s]'),
						Ram: `${(allShardsMemoryUsedByProcess[n] / 1024 / 1024).toFixed(2)} MB`,
						Guilds: guildsPerShardCount[n],
					});
					return p;
				},
				[],
			);

			const shardCount = ctx.client.shard.count;

			const getAverage = (arr) => arr.reduce((p, c) => p + c, 0) / shardCount;

			tabled.push({
				Ping: `${getAverage(allShardsPing).toFixed(2)}ms`,
				Status: 'AVERAGE',
				Uptime: moment.duration(getAverage(allShardsUptime)).format('D[d], H[h], m[m], s[s]'),
				Ram: `${(getAverage(allShardsMemoryUsedByProcess) / 1024 / 1024).toFixed(2)} MB`,
				Guilds: parseInt(getAverage(guildsPerShardCount).toFixed(2)),
			});
			const ts = new Transform({
				transform(chunk, _, cb) {
					cb(null, chunk);
				},
			});
			const logger = new Console({ stdout: ts });

			const getTable = (data) => {
				logger.table(data);
				return (ts.read() || '').toString();
			};

			const stringTable = getTable(tabled);
			await ctx.makeMessage({
				content: `\`\`\`${stringTable
					.replace('(index)', ' Shard ')
					.replace(/'/g, ' ')
					.slice(0, 1992)}\`\`\``,
			});
			return;
		}
		const apiPing = await HTTPrequests.getMitsyApiPing();

		const embed = new MitsyEmbed()
			.setTitle('🏓 | Pong!')
			.setDescription(
				`${Emotes.emotes.MITSY_OK} | ${ctx.locale('commands:ping.api')} **${
					Date.now() - ctx.interaction.createdTimestamp
				}ms**\n📡 | ${ctx.locale('commands:ping.latency')} **${Math.round(
					ctx.client.ws.ping,
				)}ms**\n${Emotes.emotes.MITSY_COFFE} | ${ctx.locale('commands:ping.mitsy_api')} **${apiPing.ws[0].ping}ms**\n${Emotes.emotes.MITSY_CONFETTI} | Shard: **${ctx.client.shard.ids}** / **${ctx.client.shard.count - 1}**`,
			)
			.setFooter(ctx.author.tag, avatar)
			.setTimestamp();

		await ctx.makeMessage({ embeds: [embed] });
	}
};
