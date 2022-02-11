const { Controller } = require('../');

// Social
module.exports = class SocialController extends Controller {
	constructor(client) {
		super({
			name: 'social',
		}, client);
		this.PERSONAL_TEXT_LIMIT = 260;
	}

	canLoad() {
		return !!this.client.database;
	}

	get _users() {
		return this.client.database.users;
	}

	async addXp(_user) {
		const { premiumLevel, xp, level } = await this._users.findOne(_user, 'premiumLevel xp level');

		const xpBonus = 1 + premiumLevel;
		const xpToLvlUp = level * 1000;
		const newxp = (Math.floor(Math.random() * 10) + 1) * xpBonus;
		await Promise.all([
			this._users.update(_user, { $inc: { xp: Number(newxp) } }),
		]);

		if (xp >= xpToLvlUp) {
			this._users.update(_user, { $inc: { level: 1 } });
		}
	}

};