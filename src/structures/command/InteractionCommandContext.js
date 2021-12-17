const {	Message } = require('discord.js');
module.exports = class InteractionCommandContext {

	constructor(options = {}) {
		this.client = options.client;
		this.data = options.data;
		this.t = options.t;
		this.interaction = options.interaction;
	}

	setFixedT(translate) {
		this.t = translate;
	}

	resolveMessage(message) {
		if (!message) return null;
		if (message instanceof Message) return message;
		return new Message(this.client, message);
	}

	async makeMessage(options) {
		if (this.interaction.replied || this.interaction.deferred) {return this.resolveMessage(await this.interaction.editReply(options));}

		return this.resolveMessage(
			await this.interaction.reply({ ...options, fetchReply: true }),
		);
	}

};