const { Loader, Connection, FileUtils } = require('../');

module.exports = class ConnectionLoader extends Loader {
	constructor(client) {
		super({}, client);

		this.connections = {};
	}

	async load() {
		try {
			await this.initializeConnections();
			this.client.connections = this.connections;
			return true;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}

	initializeConnections(dirPath = 'src/connections') {
		let success = 0;
		let failed = 0;
		return FileUtils.requireDirectory(dirPath, (NewConnection) => {
			if (Object.getPrototypeOf(NewConnection) !== Connection) return;
			this.addConnection(new NewConnection(this.client)) ? success++ : failed++;
		}, (e) => this.client.logger.error(e)).then(() => {
			if (failed) this.client.logger.info({ tag: 'Conexões' }, `${success} Conexões foram carregadas, ${failed} falharam.`);
			else this.client.logger.info({ tag: 'Conexões' }, `Todas as ${success} conexões foram carregadas sem erros.`);
		});
	}
	addConnection(connection) {
		if (!(connection instanceof Connection)) {
			this.client.logger.warn({ tag: 'Conexões' }, `${connection.name} não é uma conexão valida`);
			return false;
		}

		if (connection.canLoad() !== true) {
			this.client.logger.warn({ tag: 'Conexões' }, `${connection.name} falha ao carregar - ${connection.canLoad() || 'a função canload deve ser true.'}`);
			return false;
		}

		this.connections[connection.name] = connection.load();
		return true;
	}
};