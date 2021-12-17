const { Loader } = require('../');
const mongoose = require('mongoose');

module.exports = class ListenerLoader extends Loader {
	constructor(client) {
		super({
			critical: true,
			preLoad: true,
		}, client);

	}

	async load() {
		try {
			await this.loadDatabase();
			this.client.database = require('../database/Mongo');
			return true;
		}
		catch (e) {
			console.log(e);
		}
		return false;
	}

	loadDatabase() {
		mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
			if (err) {
				return console.log(`[DATABASE] Não foi possível se conectar a database: ${err}`);
			}

			console.log('[DATABASE] Conectado a database');
		});
	}

};