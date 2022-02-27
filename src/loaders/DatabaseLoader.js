const { Loader } = require('../');
const { DbSet } = require('../database');
const { PrismaClient } = require('@prisma/client');

module.exports = class DatabaseLoader extends Loader {
	constructor(client) {
		super({
			preLoad: true,
		}, client);

		this.database = null;
	}

	async load() {
		try {
			await this.initializeDatabase();
			console.log(this.database);
			this.client.database = this.database;
			return this.database;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}

	async initializeDatabase() {
		const prisma = new PrismaClient();
		await prisma.$connect();
		this.database = new DbSet(prisma)
			.then(() => this.client.logger.info({ tag: 'Database' }, 'Conectado com a database'))
			.catch(e => {
				this.client.logger.error('Database', e.message);
				this.database = null;
			});
	}
};