module.exports = class RemindManager {
	constructor(client) {
		this.client = client;
		this.queue = [];
		this.interval = null;
	}

	destroy() {
		this._clearInterval();
	}

	async init() {
		const { reminders } = this.client.database;
		const entries = await reminders.findMany();

		for (const entry of entries) this._insert(entry);
		this._checkInterval();
	}

	async add(timeResolvable, user, channel, guild, content) {
		const reminder = await this.client.database.reminders.create({
			data: {
				user: user.id,
				channel_id: channel.id,
				guild_id: guild.id,
				remind_at: timeResolvable,
				content,
			},
		});

		this._insert(reminder);
		this._checkInterval();
		return reminder;
	}

	async remove(entityOrId) {
		if (typeof entityOrId === 'number') {
			entityOrId = this.queue.find((entity) => entity.id === entityOrId);
			if (!entityOrId) return false;
		}

		await this.client.database.reminders.delete({
			where: {
				id: entityOrId.id,
			},
		});

		await entityOrId;
		this._remove(entityOrId);
		this._checkInterval();
		return entityOrId;
	}

	async execute() {
		if (this.queue.length) {
			const now = Date.now();
			const execute = [];
			for (const entry of this.queue) {
				if (entry.remind_at > now) break;
				execute.push(entry);
			}
			if (!execute.length) return;
			await this._handleResponses(await Promise.all(execute));
		}

		this._checkInterval();
	}

	_insert(entity) {
		const index = this.queue.findIndex((entry) => entry.time > entity.time);
		if (index === -1) this.queue.push(entity);
		else this.queue.splice(index, 0, entity);

		return entity;
	}

	_remove(entity) {
		const index = this.queue.findIndex((entry) => entry === entity);
		if (index !== -1) this.queue.splice(index, 1);
	}

	async _handleResponses(responses) {
		for (const response of responses) {

			const guild = this.client.guilds.cache.get(response.guild_id);
			const channel = guild.channels.cache.get(response.channel_id);
			const message = `<:mitsy_water:906130297165348906> **|** <@${response.user}>\nVocê me pediu para te lembrar de ${response.content} (espero que eu não tenha esquecido <:mitsy_notlikethis:873337141671911495>)!`;
			if (!channel.id) {
				// send in user dm
				const user = this.client.users.cache.get(response.user);
				if (!user) continue;
				user.send(message);
			}
			else {
				// send in channel
				channel.send(message);
			}
			await this.client.database.reminders.delete({
				where: {
					id: response.id,
				},
			});
			this.queue = this.queue.filter((responsa) => responsa !== response);
		}
	}

	/**
	 * Clear the current interval
	 */
	_clearInterval() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	}

	_checkInterval() {
		if (!this.queue.length) {
			this._clearInterval();
		}
		else if (!this.interval) {
			this.interval = setInterval(this.execute.bind(this), 5000).unref();
		}
	}
};