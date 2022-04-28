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

	async blacklistUser(user, reason, blacklister) {
		const bl = this.client.database.blacklist.user.blacklisted.findUnique({ where: { user } });
		if (!bl) {
			await this.client.database.blacklist.user.blacklisted.create({
				data:{
					user,
					reason,
					banned_by: blacklister,
					expires_at: 0,
				},
			});
		}
	}

	async unblacklistUser(user) {
		const bl = this.client.database.blacklist.user.blacklisted.findUnique({ where: { user } });
		if (bl) {
			await this.client.database.blacklist.user.blacklisted.delete({
				where: { user },
			});
		}
	}

	async unblacklistGuild(guild) {
		const bl = this.client.database.blacklist.guild.blacklisted.findUnique({ where: { guild } });
		if (bl) {
			await this.client.database.blacklist.guild.blacklisted.delete({
				where: { guild },
			});
		}
	}

	async blacklistGuild(guild, reason) {
		const bl = this.client.database.blacklist.guild.blacklisted.findUnique({ where: { guild } });
		if (!bl) {
			await this.client.database.blacklist.guild.blacklisted.create({
				data: {
					guild,
					reason,
				},
			});
		}
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
		const guild = this.client.guilds.fetch('775328200044838922');
		console.log(guild.members);
		if (guild.members.cache.has(_user)) {
			const user = await guild.members.fetch(_user);
			if (user.roles.cache.some(role => role.id === '775328405361131561')) return 4;
			if (user.roles.cache.some(role => role.id === '775335296757006356')) return 3;
			if (user.roles.cache.some(role => role.id === '775328685640646710')) return 2;
			if (user.roles.cache.some(role => role.id === '775338641370513418')) return 1;
		}
		return 0;
	}
};