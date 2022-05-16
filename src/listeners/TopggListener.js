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
			fetch(`https://top.gg/api/bots/${this.user.id}/stats`, {
				method: 'POST',
				headers: { Authorization: process.env.DBL_TOKEN },
				body: { server_count: this.guilds.size },
			})
				.then(() => this.logger.info('Estatísticas enviadas ao TopGG', { tags: ['top.gg'] }))
				.catch(() => this.logger.error('Falha ao enviar estatísticas para o TopGG', { tags: ['top.gg'] }));

			setInterval(() => {
				fetch(`https://top.gg/api/bots/${this.user.id}/stats`, {
					method: 'POST',
					headers: { Authorization: process.env.DBL_TOKEN },
					body: { server_count: this.guilds.size },
				})
					.then(() => this.logger.info('Estatísticas enviadas ao TopGG', { tags: ['top.gg'] }))
					.catch(() => this.logger.error('Falha ao enviar estatísticas para o TopGG', { tags: ['top.gg'] }));

			}, 1800000, this);

		}
	}
};