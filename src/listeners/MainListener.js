const { EventListener, HTTPrequests } = require('../');
const { PlayerManager } = require('../media/music');

module.exports = class MainListener extends EventListener {
	constructor(client) {
		super({
			events: ['ready'],
		}, client);
	}

	onReady() {

		if (process.env.DESATIVANDO_TEMPORARIAMENTE) {
			const updateActivity = async (shard) => this.user.setActivity(await HTTPrequests.getActivity(shard));

			const shardId = this.shard.ids.toString();

			setInterval(() => {
				updateActivity(shardId);
			}, 1000 * 30);
		}
		else {
			const updateActivity = async (shard) => this.user.setActivity(await HTTPrequests.getActivity(shard));
			const shardId = this.shard.ids.toString();

			this.logger.info({ tag: 'Atividade' }, 'Status rotativo desativado');
			updateActivity(shardId);
		}

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
	}
};