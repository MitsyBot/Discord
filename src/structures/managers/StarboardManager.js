const { Collection } = require('@discordjs/collection');

module.exports = class StarboardManager extends Collection {
	constructor(guild, client) {
		super();
		this.client = client;
		this.syncMessageMap = new WeakMap();
		this.syncMap = new Map();
		this.guild = guild;
	}
	set(key, value) {
		if (this.size >= 25) {
			const entry = this.reduce((acc, sMes) => (acc.lastUpdated > sMes.lastUpdated ? sMes : acc), this.first());
			this.delete(entry.messageId);
		}
		return super.set(key, value);
	}

	async getStarboardChannel() {
		const guild = await this.client.database.guild.ensure(this.guild);
		const channelId = guild.starboard.starboard_channel;
		if (!channelId) return null;
		return (this.guild.channels.cache.get(channelId) ?? null);
	}

	async getMinimumStars() {
		const guild = await this.client.database.guild.ensure(this.guild);
		return guild.starboard.required_stars;
	}

	async fetch(channel, messageId) {
		const entry = super.get(messageId);
		if (entry) return entry;

		const previousPending = this.syncMap.get(messageId);
		if (previousPending) return previousPending;

		const newPending = this.fetchEntry(channel, messageId).finally(() => this.syncMap.delete(messageId));
		this.syncMap.set(messageId, newPending);
		return newPending;
	}

	async fetchEntry(channel, messageId) {
		const message = (await channel.messages.fetch(messageId).catch(() => null));
		if (!message) return null;

		const previous = await this.client.database.starboards.stars.findOne({ where: { id: messageId } });

		if (previous) {
			this.client.database.starboard.stars.update({
				where: {
					id: message.id,
				},
				data: {
					stars: previous.stars + 1,
				},
			});
			if (!previous.id) return null;
		}

		const star = previous ?? this.client.database.starboard.stars.create({
			data: {
				stars: 1,
				message: message.content,
				id: message.id,
				channel: message.channel.id,
				guild: this.guild.id,
				user: message.author.id,
			},
		});

		this.set(messageId, star);

		return star.enabled ? star : null;
	}
};