const { EventListener, HTTPrequests } = require('../');
const { PlayerManager } = require('../media/music');

module.exports = class MainListener extends EventListener {
	constructor(client) {
		super({
			events: ['ready'],
		}, client);
	}

	onReady() {

		const updateActivity = async (shard) => this.user.setActivity(await HTTPrequests.getActivity(shard));

		const shardId = this.shard.ids.toString();

		setInterval(() => {
			updateActivity(shardId);
		}, 1000 * 30);

		if (process.env.LAVALINK_NODES) {
			try {
				const nodes = JSON.parse(process.env.LAVALINK_NODES);
				if (!Array.isArray(nodes)) throw new Error('PARSE_ERROR');
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

		if (!this.shard.ids.includes(0)) {
			setInterval(() => {
				console.log('Status enviado');
				postShardStatus(this);
			}, 15 * 1000);
		}

		async function postShardStatus(client) {
			console.log('Passou pelo postShard');
			const ShardingEnded = await client.isShardingProcessEnded();
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