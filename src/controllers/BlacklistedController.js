const { Controller } = require('../');

// Developer
module.exports = class DeveloperController extends Controller {
	constructor(client) {
		super({
			name: 'developer',
		}, client);
	}

	canLoad() {
		return !!this.client.database;
	}

	async blacklist(_user, reason, blacklister) {
		await this._users.update(_user, { blacklisted: { reason, blacklister } });
	}

	async unblacklist(_user) {
		await this._users.update(_user, { blacklisted: null });
	}

	async userBlacklisted(_user) {
		const user = await this.client.database.blacklist.ensureUserBlacklistInfos(_user);
		return user ? user.blacklisted : null;
	}
	async guildBlacklisted(_guild) {
		const guild = await this.client.database.blacklist.ensureGuildBlacklistInfos(_guild);
		return guild;
	}

	async getDeveloper(_user) {
		const user = this.client.guilds.cache.get('775328200044838922').members.cache.get(_user);
		console.log(this.client.guilds.cache.get('775328200044838922'));
		if (user.roles.cache.some(role => role.id === '775328405361131561')) return 4;
		if (user.roles.cache.some(role => role.id === '775335296757006356')) return 3;
		if (user.roles.cache.some(role => role.id === '775328685640646710')) return 2;
		if (user.roles.cache.some(role => role.id === '775338641370513418')) return 1;
		return 0;
	}
};