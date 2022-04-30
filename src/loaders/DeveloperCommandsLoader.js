const { Loader, DevCommand, FileUtils } = require('../');

module.exports = class DevCommands extends Loader {
	constructor(client) {
		super({
			critical: true,
		}, client);

		this.devCommands = [];
		this.posLoadDevCommands = [];
	}

	async load() {
		try {
			await this.initializeCommands();
			this.client.devCommands = this.devCommands;
			return true;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}

	initializeCommands(dirPath = 'src/commands/developers') {
		let success = 0;
		let failed = 0;
		return FileUtils.requireDirectory(dirPath, (NewCommand, path) => {
			this.addCommand(new NewCommand(this.client), path) ? success++ : failed++;
		}, (e) => this.client.logger.error(e)).then(() => {
			if (failed) this.client.logger.info({ tag: 'Dev' }, `${success} comandos carregados, ${failed} falharam.`);
			else this.client.logger.info({ tag: 'Dev' }, `Todos os ${success} comandos foram carregados.`);
		});
	}

	addCommand(command, path) {
		command.path = path;
		const check = this.checkCommand(command);
		if (!check) return check;
		this.devCommands.push(command);
		return true;
	}
	checkCommand(command) {
		if (!(command instanceof DevCommand)) {
			this.client.logger.warn({ tag: 'Dev' }, `${command} falha ao carregar - Não é um comando`);
			return false;
		}

		if (command.canLoad() !== true) {
			this.client.logger.warn({ tag: 'Dev' }, `${command.fullName} Falha ao carregar - ${command.canLoad() || 'a função canLoad deve ser true.'}`);
			return false;
		}
		return true;

	}
};