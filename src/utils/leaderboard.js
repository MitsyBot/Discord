const { Collection } = require('discord.js');
const PreciseTimeout = require('./PreciseTimeout');
module.exports = class Leaderboard {
	constructor(client) {
		this.client = client;
		this.global = new Collection();
		this.kTempPromises = {
			guilds: new Collection(),
			users: null,
		};
		this.kTimeouts = {
			guilds: new Collection(),
			users: null,
		};

	}


	async fetch() {
		if (this.kTempPromises.users) await this.kTempPromises.users;
		else if (this.global.size === 0) await this.syncUsers();
		return this.global;
	}

	dispose() {
		this.clearGuilds();
		this.clearUsers();
	}

	clearGuilds() {
		for (const timeout of this.kTimeouts.guilds.values()) {
			timeout.stop();
		}
	}

	clearUsers() {
		if (this.kTimeouts.users) {
			this.kTimeouts.users.stop();
		}
	}

	async syncUsers() {
		const promise = new Promise((resolve) => this.createUserSyncHandle().then(resolve));
		await (this.kTempPromises.users = promise);

		this.clearUsers();

		this.kTimeouts.users = new PreciseTimeout(15 * 60000);

		this.kTimeouts.users.run().then(() => {
			this.kTimeouts.users = null;
			this.global.clear();
		});
	}

	async createUserSyncHandle() {
		const data = await this.client.database.user.profiles.findMany({
			select: {
				id: true,
				global_xp: true,
			},
			where: {
				global_xp: {
					gt: 25,
				},
			},
			orderBy: [
				{
					global_xp: 'desc',
				},
			],
			take: 25000,
		});


		this.global.clear();

		let i = 0;
		for (const entry of data) {
			this.global.set(entry.id, { points: entry.points, position: ++i });
		}

		this.kTempPromises.users = null;
	}


};