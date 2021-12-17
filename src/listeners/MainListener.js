const { EventListener, HTTPrequests } = require('../');

module.exports = class MainListener extends EventListener {
	constructor(client) {
		super({
			events: ['ready'],
		}, client);
	}

	onReady() {
		if (process.env.API_URL) {
			const updateActivity = async (shard) => this.user.setActivity(await HTTPrequests.getActivity(shard));

			const shardId = this.shard.ids.toString();

			setInterval(() => {
				updateActivity(shardId);
			}, 1000 * 30);
		}
		else {
			this.logger.info({ tag: 'Atividade' }, 'Status rotativo desativado');
			this.user.setActivity({ name: `❤️ | Howdy | Shard ${this.shard.ids.toString()}`, type: 'PLAYING' });
		}
	}
};