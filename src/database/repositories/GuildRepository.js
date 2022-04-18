// VAI TOMAR NO CU
module.exports = class GuildRepository {
	constructor(connection) {
		this.general = connection.GuildConfig;
		this.event_log = connection.EventLogConfigs;
		this.invite_blocker = connection.InviteBlockerConfigs;
		this.keys = connection.DonationKeys;
		this.birthday = connection.BirthdayConfigs;
		this.welcomer = connection.WelcomerConfig;
	}
	async ensure(id) {

		const general = await this.ensureGeneral(id);
		const key = await this.getGuildKeys(id);
		const event_log = await this.ensureLogConfigs(id);
		const invite_blocker = await this.ensureInviteConfigs(id);
		const birthday = await this.ensureBirthday(id);
		const welcomer = await this.ensureWelcomer(id);
		return { general, welcomer, birthday, key, event_log, invite_blocker };
	}


	async ensureGeneral(id) {
		const previous = await this.general.findUnique({
			where: {
				id,
			},
		});
		if (previous) return previous;

		const data = await this.general.create({ data: {
			id,
		},
		});

		return data;
	}

	async ensureWelcomer(id) {
		const previous = await this.welcomer.findUnique({ where: { id } });
		if (previous) return previous;

		const data = await this.welcomer.create({ data: {
			id,
		},
		});
		return data;
	}

	async ensureBirthday(id) {
		const previous = await this.birthday.findUnique({ where: { id } });
		if (previous) return previous;

		const data = await this.birthday.create({ data: {
			id,
		},
		});

		return data;
	}

	async getGuildKeys(id) {
		const previous = await this.keys.findUnique({ where: { active_in: id } });
		return previous;
	}
	async ensureLogConfigs(id) {
		const previous = await this.event_log.findUnique({ where: { id } });
		if (previous) return previous;

		const data = await this.event_log.create({ data: {
			id,
		},
		});

		return data;
	}

	async ensureInviteConfigs(id) {
		const previous = await this.invite_blocker.findUnique({ where: { id } });
		if (previous) return previous;

		const data = await this.invite_blocker.create({ data: {
			id,
		},
		});

		return data;
	}
};