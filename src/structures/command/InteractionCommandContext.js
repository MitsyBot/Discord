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

	async getEmoji(args) {
		if (!args) return false;
		if (args.includes('%')) args = decodeURIComponent(args);
		if (!args.includes(':')) {
			const emoji = this.interaction.guild.emojis.cache.find(emojij => emojij.name.toLowerCase().includes(args.toLowerCase())) || this.interaction.guild.emojis.cache.find(emojij => emojij.id === args);
			if (emoji) {
				return {
					animated: emoji.animated,
					name: emoji.name,
					mention: `${emoji.animated ? '<a:' : '<:'}${emoji.name}:${emoji.id}>`,
					id: emoji.id,
					url: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}?v=1`,
				};
			}

			const axios = require('axios');
			try {
				if (await axios.get(`https://twemoji.maxcdn.com/2/72x72/${this.toUnicode(args).join('-')}.png`)) {
					return {
						animated: false,
						name: args,
						mention: args,
						id: this.toUnicode(args).join('-').toString(0),
						url: `https://twemoji.maxcdn.com/2/72x72/${this.toUnicode(args).join('-')}.png`,
					};
				}
				else {
					return false;
				}
			}
			catch {
				return false;
			}
		}

		const m = args.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
		if (!m) return false;
		if (m[2] && !m[3]) return false;

		return {
			animated: Boolean(m[1]),
			name: m[2],
			mention: `${m[1] ? '<a:' : '<:'}${m[2]}:${m[3]}>`,
			id: m[3],
			url: `https://cdn.discordapp.com/emojis/${m[3]}.${m[1] ? 'gif' : 'png'}?v=1`,
		};
	}

	toUnicode(text) {
		const emojis = [];
		for (const codePoint of text) {
			emojis.push(codePoint.codePointAt(0).toString(16));
		}
		return emojis;
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