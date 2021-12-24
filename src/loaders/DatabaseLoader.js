const { Loader } = require('../');
const { MongoDB } = require('../database');

module.exports = class DatabaseLoader extends Loader {
	constructor(client) {
		super({
			preLoad: true,
		}, client);

		this.database = null;
	}

	async load() {
		try {
			await this.initializeDatabase(MongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
			this.client.database = this.database;
			return !!this.database;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}

	initializeDatabase(DBWrapper = MongoDB, options = {}) {
		if (DBWrapper.envVars && !DBWrapper.envVars.every(v => {
			if (!process.env[v]) this.client.logger.warn({ tag: 'Database' }, `Você não definiu a variavel "${v}".`);
			return !!process.env[v];
		})) return false;

		this.database = new DBWrapper(options);
		this.database.connect()
			.then(() => this.client.logger.info({ tag: 'Database' }, 'Conectado com a database'))
			.catch(e => {
				this.client.logger.error('Database', e.message);
				this.database = null;
			});
	}
};