module.exports = class DbSet {

	constructor(connection) {
		this.connection = connection;
		this.user = {};
		this.user.profiles = connection.UserProfile;
		this.user.general = connection.UserGeneralConfig;
		this.user.cooldowns = connection.UserCooldowns;
	}
	async getUser(_id) {
		let UserGeneral = await this.user.general.findUnique({
			where: {
				id: _id,
			},
		});

		let UserCooldowns = await this.user.cooldowns.findUnique({
			where: {
				id: _id,
			},
		});

		let UserProfile = await this.user.profiles.findUnique({
			where: {
				id: _id,
			},
		});

		if (!UserProfile && !UserCooldowns && !UserGeneral) {
			UserGeneral = await this.user.general.create({
				data: {
					id: _id,
				},
			});
			UserCooldowns = await this.user.cooldowns.create({
				data: {
					id: _id,
				},
			});
			UserProfile = await this.user.profiles.create({
				data: {
					id: _id,
				},
			});
		}
		const body = {
			profile: UserProfile,
			cooldowns: UserCooldowns,
			general: UserGeneral,
		};

		return body;

	}
};