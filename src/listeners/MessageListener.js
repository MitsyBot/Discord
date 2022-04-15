const { EventListener } = require('../');

module.exports = class MessageListener extends EventListener {
	constructor(client) {
		super({
			events: ['messageCreate'],
		}, client);
	}

	async onMessageCreate(message) {
		if (message.author.bot || !this.loaded) return;
		if (message.interaction) return;

		this.controllers.social.addXp(message.author.id);
	}
};