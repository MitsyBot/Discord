module.exports = class InteractionCommandContext {
	constructor(options = {}) {
		this.client = options.client;
		this.message = options.message;
		this.args = options.args;
		this.guild = options.guildId;
	}

	get channel() {
		return this.message.channel;
	}
};