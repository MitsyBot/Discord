const { Loader, InteractionCommand, FileUtils } = require('../');

module.exports = class CommandLoader extends Loader {
	constructor(client) {
		super({
			critical: true,
		}, client);

		this.slashCommands = [];
		this.posLoadSlashCommands = [];
	}

	async load() {
		try {
			await this.initializeCommands();
			this.client.slashCommands = this.slashCommands;
			return true;
		}
		catch (e) {
			console.error(e);
		}
		return false;
	}


	initializeCommands(dirPath = 'src/commands') {
		let success = 0;
		let failed = 0;
		return FileUtils.requireDirectory(dirPath, (NewCommand, path) => {
			this.addCommand(new NewCommand(this.client), path) ? success++ : failed++;
		}, (e) => this.client.logger.error(e)).then(() => {
			if (failed) this.client.logger.info({ tag: 'Comandos' }, `${success} Comandos carregados, porem ${failed} falharam ao carregar.`);
			else this.client.logger.info({ tag: 'Comandos' }, `Todos os ${success} Comandos foram carregados sem nenhum erro.`);
		});
	}

	addCommand(command, path) {
		command.path = path;
		const check = this.checkCommand(command);
		if (!check) return check;
		this.slashCommands.push(command);

		return true;
	}
	checkCommand(command) {
		if (!(command instanceof InteractionCommand)) {
			this.client.logger.warn({ tag: 'Comandos' }, `Falha ao carregar, ${command}  não é um comando`);
			return false;
		}

		if (command.canLoad() !== true) {
			this.client.logger.warn({ tag: 'Comandos' }, `Falha ao carregar ${command.fullName}  ${command.canLoad() || 'A função canload não retornou true.'}`);
			return false;
		}

		return true;
	}
};