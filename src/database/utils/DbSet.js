const { connect } = require('../database.config');

module.exports = class DbSet {

	constructor(connection) {
		this.connection = connection;
		this.users = null;
		this.user.profiles = connection.userprofile;
		this.users.general = connection.usergeneralconfig;
		this.users.cooldowns = connection.usercooldowns;
	}
	async getUser(_id) {
		let UserGeneral = await this.users.general.findUnique({
			where: {
				id: _id,
			},
		});

		let UserCooldowns = await this.users.cooldowns.findUnique({
			where: {
				id: _id,
			},
		});

		let UserProfile = await this.users.profiles.findUnique({
			where: {
				id: _id,
			},
		});

		if (!UserProfile && !UserCooldowns && !UserGeneral) {
			UserGeneral = await this.users.general.create({
				data: {
					id: _id,
				},
			});
			UserCooldowns = await this.users.cooldowns.create({
				data: {
					id: _id,
				},
			});
			UserProfile = await this.users.profiles.create({
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

	static async connect() {
		return (DbSet.instance ??= await (DbSet.connectPromise ??= connect().then((connection) => {
			DbSet.connectPromise = null;
			return new DbSet(connection);
		})));
	}
};