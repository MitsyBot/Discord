const { Loader, EventListener, FileUtils } = require('../');

module.exports = class ListenerLoader extends Loader {
	constructor(client) {
		super({
			critical: true,
			preLoad: true,
		}, client);

		this.listeners = [];
	}

	async load() {
		try {
			await this.initializeListeners();
			this.client.listeners = this.listeners;
			return true;
		}
		catch (e) {
			this.lgger.error(e);
		}
		return false;
	}

	initializeListeners(dirPath = 'src/listeners') {
		let success = 0;
		let failed = 0;
		return FileUtils.requireDirectory(dirPath, (NewListener) => {
			if (Object.getPrototypeOf(NewListener) !== EventListener) return;
			this.addListener(new NewListener(this.client)) ? success++ : failed++;
		}, (e) => this.client.logger.error(e)).then(() => {
			if (failed) this.client.logger.info({ tag: 'Listeners' }, `${success} listeners carregados, porem ${failed} falharam ao carregar.`);
			else this.client.logger.info({ tag: 'Listeners' }, `Todos os ${success} listeners foram carregados com sucesso.`);
		});
	}

	addListener(listener) {
		if (!(listener instanceof EventListener)) {
			this.client.logger.error(`Ocorreu um erro ao carregar o listener ${listener.name}, Não parece ser um listener`);
			return false;
		}

		const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
		listener.events.forEach(event => {
			this.client.on(event, listener['on' + capitalize(event)]);
		});

		this.listeners.push(listener);
		return true;
	}
};