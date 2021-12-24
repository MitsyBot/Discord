const { Loader, Module, FileUtils } = require('../');

module.exports = class ModuleLoader extends Loader {
	constructor(client) {
		super({}, client);

		this.modules = {};
	}

	async load() {
		try {
			await this.initializeModules();
			this.client.modules = this.modules;
			return true;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}

	initializeModules(dirPath = 'src/modules') {
		let success = 0;
		let failed = 0;
		return FileUtils.requireDirectory(dirPath, (NewModule) => {
			if (Object.getPrototypeOf(NewModule) !== Module) return;
			this.addModule(new NewModule(this.client)) ? success++ : failed++;
		}, (e) => this.client.logger.error(e)).then(() => {
			if (failed) this.client.logger.info({ tag: 'Modulo' }, `${success} modulos carregados, porem ${failed} falharam.`);
			else this.client.logger.info({ tag: 'Modulo' }, `Todos os ${success} modulos foram carregados com sucesso.`);
		});
	}

	addModule(module) {
		if (!(module instanceof Module)) {
			this.client.logger.warn({ tag: 'Modulo' }, `Falha ao carregar ${module.name} não é um modulo`);
			return false;
		}

		this.modules[module.name] = module;
		return true;
	}
};