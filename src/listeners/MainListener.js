const { EventListener, HTTPrequests } = require('../');
const { PlayerManager } = require('../media/music');
const moment = require('moment');
const CronJob = require('cron').CronJob;

module.exports = class MainListener extends EventListener {
	constructor(client) {
		super({
			events: ['ready'],
		}, client);
	}

	onReady() {
		let isFanartDay = false;
		const checkFanartDay = () => { if (moment().format('dddd') === 'Friday') return true; };

		if (checkFanartDay()) isFanartDay = true;

		const job = new CronJob('0 */24 * * *', async () => {
			if (checkFanartDay()) {isFanartDay = true;}
			else {
				isFanartDay = false;
				this.user.setAvatar('https://imgur.com/yZVrWCl.png');
			}
		}, null, true, 'America/Sao_Paulo');
		job.start();


		const updateActivity = async (shard) => this.user.setActivity(await HTTPrequests.getActivity(shard));

		const shardId = this.shard.ids.toString();

		updateActivity(shardId);


		setInterval(() => {
			if (!isFanartDay) {
				this.logger.info({ tag: 'RPC' }, 'Status alterado');
				updateActivity(shardId);
			}
		}, 1000 * 30);

		setInterval(async () => {
			if (isFanartDay) {
				const fanart = await HTTPrequests.getFanarts(shardId);
				this.logger.info({ tag: 'RPC' }, 'Status alterado');
				this.user.setActivity(fanart.activity);
				this.logger.info({ tag: 'RPC' }, 'Avatar alterado');
				this.user.setAvatar(fanart.avatar);
			}
		}, 1000 * 600);

		if (process.env.LAVALINK_NODES) {
			try {
				const nodes = [
					{ id: '1', host: '198.12.96.170', port: 2333, password: 'mitsybot123' },
				];				if (!Array.isArray(nodes)) throw new Error('PARSE_ERROR');
				this.playerManager = new PlayerManager(this, nodes, {
					user: this.user.id,
					shards: 1,
				});
				this.playerManager.connect()
					.then(() => this.logger.info({ tag: 'Musica' }, 'Lavalink conectado!'))
					.catch(() => this.logger.error({ tag: 'Music' }, 'Falha ao conectar com o lavalink.'));
			}
			catch (e) {
				this.logger.error({ tag: 'Musica' }, e);
			}
		}

		if (this.shard.ids.includes(0)) {
			setInterval(() => {
				postShardStatus(this);
			}, 15 * 1000);
		}

		async function postShardStatus(client) {
			const ShardingEnded = await client.ShardingEnded();
			if (!ShardingEnded) return;

			const getShardsInfo = (c) => {
				const memoryUsed = process.memoryUsage().heapUsed;
				const { uptime } = c;
				const guilds = c.guilds.cache.size;
				const unavailable = c.guilds.cache.reduce((p, b) => (b.available ? p : p + 1), 0);
				const { ping } = c.ws;
				const members = c.guilds.cache.reduce((p, b) => (b.available ? p + b.memberCount : p), 0);
				const id = c.shard?.ids[0] ?? 0;

				return { memoryUsed, uptime, guilds, unavailable, ping, members, id };
			};

			const results = await client.shard?.broadcastEval(getShardsInfo);
			if (!results) return;

			const toSendData = Array(client.shard?.count)
				.fill('a')
				.map((_, i) => ({
					...results[i],
					lastPingAt: Date.now(),
				}));

			await HTTPrequests.postShardStatus(toSendData);
		}
	}
};