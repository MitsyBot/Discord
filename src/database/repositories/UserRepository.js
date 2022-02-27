module.exports = class UserRepository {
	constructor(connection) {
		this.profiles = connection.UserProfile;
		this.general = connection.UserGeneralConfig;
		this.cooldowns = connection.UserCooldowns;
	}
	async ensure(id) {
		const previous = await this.general.findUnique({ where: { id } });
		if (previous) return previous;

		const data = await this.general.create({ data: { id } });
		return data;
	}

	async ensureProfile(id) {

		const previous = await this.profiles.findUnique({
			where: {
				id,
			},
			include: {
				profile: true,
			},
		});

		if (previous.profile) return previous;

		const data = await this.profiles.create({
			data: {
				id,
				backgrounds: {
					set: ['mitsy_1'],
				},
				profiles: {
					set: ['default'],
				},
				active_colors: {
					set:['#f895fb'],
				},
			},
		});
		return data;
	}

	async ensureCooldowns(id) {
		const previous = await this.general.findUnique({
			where: {
				id,
			},
			include: {
				cooldowns: true,
			},
		});

		if (previous.cooldowns) return previous;

		const data = await this.cooldowns.create({
			data: {
				id: id,
			},
		});

		return data;
	}

	async ensureUserInfos(id) {
		const general = await this.ensure(id);
		const cooldowns = await this.ensureCooldowns(id);
		const profile = await this.ensureProfile(id);
		console.log(profile);
		return { general, cooldowns: cooldowns.cooldowns, profile: profile.profile };
	}

	async addComets(id, amount) {
		const previous = await this.general.findUnique({
			where: {
				id,
			},
			include: {
				profile: true,
			},
		});
		if (!previous.profile) {
			return await this.user.profiles.create({
				data: {
					id,
					comets: amount,
					backgrounds: {
						set: ['mitsy_1'],
					},
					profiles: {
						set: ['default'],
					},
					active_colors: {
						set:['#f895fb'],
					},
				},
			});
		}

		return await this.user.profiles.update({
			where: {
				id,
			},
			data: {
				comets: {
					increment: amount,
				},
			},
		});
	}

	async removeComets(id, amount) {
		return await this.user.profiles.update({
			where: {
				id,
			},
			data: {
				comets: {
					decrement: amount,
				},
			},
		});
	}
};