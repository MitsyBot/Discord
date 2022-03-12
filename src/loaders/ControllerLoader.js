const { Loader, Controller, FileUtils } = require('../');

module.exports = class ControllerLoader extends Loader {
	constructor(client) {
		super({}, client);

		this.controllers = {};
	}

	async load() {
		try {
			await this.initializeControllers();
			this.client.controllers = this.controllers;
			return true;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}

	initializeControllers(dirPath = 'src/controllers') {
		let success = 0;
		let failed = 0;
		return FileUtils.requireDirectory(dirPath, (NewController) => {
			if (Object.getPrototypeOf(NewController) !== Controller) return;
			this.addController(new NewController(this.client)) ? success++ : failed++;
		}, (e) => this.client.logger.error(e)).then(() => {
			if (failed) this.client.logger.info({ tag: 'Controllers' }, `${success} alguns controllers foram carregados porem ${failed} falhou.`);
			else this.client.logger.info({ tag: 'Controllers' }, `Todos os ${success} controllers foram carregados.`);
		});
	}


	addController(controller) {
		if (!(controller instanceof Controller)) {
			this.client.logger.warn({ tag: 'Controllers' }, `Ocorreu um erro ao carregar ${controller.name} não é um controller valido`);
			return false;
		}

		if (controller.canLoad() !== true) {
			this.client.logger.warn({ tag: 'Controllers' }, `Ocorreu um erro ao carregar ${controller.name} - ${controller.canLoad() || 'canLoad esta definido como false.'}`);
			return false;
		}

		this.controllers[controller.name] = controller.load();
		return true;
	}
};