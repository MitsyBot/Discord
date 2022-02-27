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

	async addXp(_user) {
		const { profile } = await this.client.database.user.ensureProfile(_user);

		const xpBonus = 1;
		const xpToLvlUp = profile.global_level * 1000;
		const newxp = (Math.floor(Math.random() * 10) + 1) * xpBonus;
		await Promise.all([
			this.client.database.user.profiles.update({
				where: {
					id: _user,
				},
				data: {
					global_xp: {
						increment: newxp,
					},
				},
			}),
		]);

		if (profile.global_xp > xpToLvlUp) {
			await Promise.all([
				this.client.database.user.profiles.update({
					where: {
						id: _user,
					},
					data: {
						global_level: {
							increment: 1,
						},
					},
				}),
			]);
		}
	}

};