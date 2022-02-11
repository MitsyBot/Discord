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
		const { premiumLevel, xp } = await this._users.findOne(_user, 'lastRep');

		const xpBonus = 1 + Number(premiumLevel);
		const xpToLvlUp = xp * 1000;
		console.log(xpBonus);
		const newxp = (Math.floor(Math.random() * 10) + 1);
		await Promise.all([
			this._users.update(_user, { $inc: { xp: Number(newxp) } }),
		]);

		if (xp >= xpToLvlUp) {
			this.database.users.update(_user, { $inc: { level: 1 } });
		}
	}

};