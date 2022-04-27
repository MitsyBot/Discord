const { EventListener, DevCommandExecutor } = require('../');

module.exports = class MessageListener extends EventListener {
	constructor(client) {
		super({
			events: ['messageCreate'],
		}, client);
	}

	async onMessageCreate(message) {
		if (message.author.bot || !this.loaded) return;
		const prefix = 'm!';
		const sw = (...s) => s.some(st => message.content.startsWith(st));
		const usedPrefix = sw(prefix) ? prefix : null;

		if (usedPrefix) {
			const fullCmd = message.content.substring(usedPrefix.length).split(/[ \t]+/).filter(a => a);
			const args = fullCmd.slice(1);
			if (!fullCmd.length) return;
			const cmd = fullCmd[0].toLowerCase().trim();
			const command = this.devCommands.find(c => c.name.toLowerCase() === cmd);

			if (command) {
				const executor = new DevCommandExecutor(this, message);
				executor.CommandExecuted(this, message, args);
			}
		}
	}
};