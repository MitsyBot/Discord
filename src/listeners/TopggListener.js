const { EventListener } = require('../');
const fetch = require('node-fetch');

module.exports = class TopGGListener extends EventListener {
	constructor(client) {
		super({
			events: ['ready'],
		}, client);
	}

	onReady() {
		if (process.env.DBL_TOKEN) {
			fetch(`https://top.gg/api/bots/${this.client.user.id}/stats`, {
				method: 'POST',
				headers: { Authorization: process.env.DBL_TOKEN },
				body: { server_count: this.client.guilds.size },
			})
				.then(() => this.client.logger.info('Estatísticas enviadas ao TopGG', { tags: ['top.gg'] }))
				.catch(() => this.client.logger.error('Falha ao enviar estatísticas para o TopGG', { tags: ['top.gg'] }));

			setInterval(() => {
				fetch(`https://top.gg/api/bots/${this.client.user.id}/stats`, {
					method: 'POST',
					headers: { Authorization: process.env.DBL_TOKEN },
					body: { server_count: this.client.guilds.size },
				})
					.then(() => this.client.logger.info('Estatísticas enviadas ao TopGG', { tags: ['top.gg'] }))
					.catch(() => this.client.logger.error('Falha ao enviar estatísticas para o TopGG', { tags: ['top.gg'] }));

			}, 1800000, this);

		}
	}
};