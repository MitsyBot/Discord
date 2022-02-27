module.exports = class DbSet {

	constructor(connection) {
		this.connection = connection;
		this.profiles = connection.userprofile;
		this.general = connection.usergeneralconfig;
		this.cooldowns = connection.usercooldowns;
	}
	async getUser(_id) {
		let UserGeneral = await this.general.findUnique({
			where: {
				id: _id,
			},
		});

		let UserCooldowns = await this.cooldowns.findUnique({
			where: {
				id: _id,
			},
		});

		let UserProfile = await this.profiles.findUnique({
			where: {
				id: _id,
			},
		});

		if (!UserProfile && !UserCooldowns && !UserGeneral) {
			UserGeneral = await this.general.create({
				data: {
					id: _id,
				},
			});
			UserCooldowns = await this.cooldowns.create({
				data: {
					id: _id,
				},
			});
			UserProfile = await this.profiles.create({
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