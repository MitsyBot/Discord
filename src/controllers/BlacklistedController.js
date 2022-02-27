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
};