const moment = require('moment');
const { MessageEmbed } = require('discord.js');

const { Console } = require('node:console');
const { Transform } = require('node:stream');
const { InteractionCommand, Emotes } = require('../../');
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
		const avatar = ctx.interaction.user.displayAvatarURL({ format: 'png', dynamic: true });

		if (ctx.interaction.options.getString('opções') === 'shards') {
			if (!(await ctx.client.ShardingEnded())) {
				ctx.makeMessage({
					content: ctx.t('common:sharding_in_progress'),
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
		const embed = new MessageEmbed()
			.setTitle('🏓 | Pong!')
			.setDescription(
				`${Emotes.MITSY_OK} | ${ctx.t('commands:ping.api')} **${
					Date.now() - ctx.interaction.createdTimestamp
				}ms**\n📡 | ${ctx.t('commands:ping.latency')} **${Math.round(
					ctx.client.ws.ping,
				)}ms**\n${Emotes.MITSY_CONFETTI} | Shard: **${ctx.client.shard.ids}** / **${ctx.client.shard.count - 1}**`,
			)
			.setFooter(ctx.interaction.user.tag, avatar)
			.setTimestamp()
			.setColor('#eab3fa');

		await ctx.makeMessage({ embeds: [embed] });
	}
};
