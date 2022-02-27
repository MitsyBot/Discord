const { UserRepository } = require('../repositories/');
module.exports = class DbSet {

	constructor(connection) {
		this.connection = connection;
		this.user = new UserRepository(connection);
		this.guild = {};
		this.guild.general = connection.GuildConfig;

	}
	async getUser(_id) {
		const general = this.user.ensure(_id);
		const cooldowns = this.user.ensureCooldowns(_id);
		const profile = this.user.ensureProfile(_id);

		return { general, cooldowns, profile };
	}

	async getGuild(_id) {
		let GuildGeneral = await this.guild.general.findUnique({
			where: {
				id: _id,
			},
		});

		if (!GuildGeneral) {
			GuildGeneral = await this.user.general.create({
				data: {
					id: _id,
				},
			});
		}

		const body = {
			general: GuildGeneral,
		};

		return body;
	}
};