module.exports = class BlacklistRepository {
	constructor(connection) {
		this.user = {};
		this.user.blacklisted = connection.BannedUsers;
		this.guild = {};
		this.guild.blacklisted = connection.BlacklistedGuilds;
	}
	async ensureUserBlacklistInfos(user) {
		const data = await this.user.blacklisted.findUnique({ where: { user } });
		return data;
	}
	async ensureGuildBlacklistInfos(guild) {
		const data = await this.guild.blacklisted.findUnique({ where: { guild } });
		return data;
	}
};