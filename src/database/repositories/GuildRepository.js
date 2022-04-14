module.exports = class GuildRepository {
	constructor(connection) {
		this.general = connection.GuildConfig;
		this.event_log = connection.EventLogConfigs;
		this.invite_blocker = connection.InviteBlockerConfigs;
		this.keys = connection.DonationKeys;
		this.birthday = connection.BirthdayConfigs;
	}
	async ensure(id) {

		const general = await this.ensureGeneral(id);
		const key = await this.getGuildKeys(id);
		const event_log = await this.ensureLogConfigs(id);
		const invite_blocker = await this.ensureInviteConfigs(id);
		const birthday = await this.ensureBirthday(id);
		return { general, birthday, key, event_log, invite_blocker };
	}


	ensureGeneral(id) {
		const previous = this.general.findUnique({ where: { id } });
		if (previous) return previous;

		const data = this.general.create({ data: {
			id,
		},
		});

		return data;
	}

	ensureBirthday(guild_id) {
		const previous = this.birthday.findUnique({ where: { guild_id } });
		if (previous) return previous;

		const data = this.birthday.create({ data: {
			guild_id,
		},
		});

		return data;
	}

	getGuildKeys(id) {
		const previous = this.keys.findUnique({ where: { active_in: id } });
		return previous;
	}
	ensureLogConfigs(guild_id) {
		const previous = this.event_log.findUnique({ where: { guild_id } });
		if (previous) return previous;

		const data = this.event_log.create({ data: {
			guild_id,
		},
		});

		return data;
	}

	ensureInviteConfigs(guild_id) {
		const previous = this.invite_blocker.findUnique({ where: { guild_id } });
		if (previous) return previous;

		const data = this.invite_blocker.create({ data: {
			guild_id,
		},
		});

		return data;
	}
};