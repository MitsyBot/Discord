const {	Message } = require('discord.js');
const { emotes } = require('../../utils/Emotes');
module.exports = class InteractionCommandContext {

	constructor(options = {}) {
		this.client = options.client;
		this.data = options.data;
		this.i18n = options.t;
		this.interaction = options.interaction;
	}

	get options() {
		return this.interaction.options;
	}

	get channel() {
		return this.interaction.channel;
	}

	get author() {
		return this.interaction.user;
	}

	async defer(
		options,
		ephemeral = false,
	) {
		if (this.interaction.deferred && options) {
			await this.send(options);
			return;
		}

		await this.interaction.deferReply({ ephemeral });
	}

	setFixedT(translate) {
		this.i18n = translate;
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

	async send(options) {
		return this.resolveMessage(await this.interaction.followUp(options));
	}

	async fetchReply() {
		return this.resolveMessage(await this.interaction.fetchReply());
	}

	async deleteReply() {
		return this.interaction.deleteReply().catch;
	}

	prettyResponse(emoji, text, translateOptions = {}) {
		return `${emotes[emoji] || '🐛'} **|** ${this.locale(text, translateOptions)}`;
	}

	locale(text, translateVars = {}) {
		return this.i18n(text, translateVars);
	}

};