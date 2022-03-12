const { Loader, APIWrapper, FileUtils } = require('../');

module.exports = class APILoader extends Loader {
	constructor(client) {
		super({
			preLoad: true,
		}, client);

		this.apis = {};
	}

	async load() {
		try {
			await this.initializeAPIs();
			this.client.apis = this.apis;
			return true;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}

	initializeAPIs(dirPath = 'src/apis') {
		let success = 0;
		let failed = 0;
		return FileUtils.requireDirectory(dirPath, (NewAPI) => {
			if (Object.getPrototypeOf(NewAPI) !== APIWrapper) return;
			this.addAPI(new NewAPI()).then(s => s ? success++ : failed++).catch(e => {
				this.client.logger.error(e);
				failed++;
			});
		}, (e) => this.client.logger.error(e)).then(() => {
			if (failed) this.client.logger.info({ tag: 'APIs' }, `${success} APIs foram carregadas, ${failed} falharam.`);
			else this.client.logger.info({ tag: 'APIs' }, `Todas as ${success} APIs foram carregadas sem nenhum erro.`);
		});
	}

	async addAPI(api) {
		if (!(api instanceof APIWrapper)) {
			this.client.logger.warn({ tag: 'APIs' }, `falha ao carregar ${api.name} - Não é um wrapper de api`);
			return false;
		}

		if (api.canLoad() !== true) {
			this.client.logger.warn({ tag: 'APIs' }, `falha ao carregar ${api.name} - ${api.canLoad() || 'canLoad deve ser true.'}`);
			return false;
		}

		if (!api.envVars.every(variable => {
			if (!process.env[variable]) this.client.logger.warn({ tag: 'APIs' }, `Falha ao carregar ${api.name} - A variavel de ambiente "${variable}" não foi definida.`);
			return !!process.env[variable];
		})) return false;

		this.apis[api.name] = await api.load();
		return true;
	}
};