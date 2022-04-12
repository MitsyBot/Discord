module.exports = class UserRepository {
	constructor(connection) {
		this.profiles = connection.UserProfile;
		this.general = connection.UserGeneralConfig;
		this.cooldowns = connection.UserCooldowns;
		this.connections = connection.UserConnections;
		this.donations = connection.UserDonations;
	}
	async ensure(id) {
		const previous = await this.general.findUnique({ where: { id } });
		if (previous) return previous;

		const data = await this.general.create({ data: { id } });
		const dados = {};
		dados.profile = data;
		return dados;
	}

	async getTodayBirthdays(date) {
		const birthdays = await this.profiles.findMany({
			where: {
				birthday: date,
			},
		});
		// Exclamação faz o if considerar se o valor for negativo
		// No caso se não tiver nada no banco ele retorna um array vazio
		return birthdays;
	}


	async ensureProfile(id) {

		const previous = await this.general.findUnique({
			where: {
				id,
			},
			include: {
				profile: true,
			},
		});

		if (previous && previous.profile) return previous;

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

		const dados = {};
		dados.profile = data;
		return dados;
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

		if (previous && previous.cooldowns) return previous;

		const data = await this.cooldowns.create({
			data: {
				id: id,
			},
		});
		const dados = {};
		dados.cooldowns = data;
		return dados;
	}

	async ensurePremium(id) {
		const previous = await this.donations.findUnique({
			where: {
				id,
			},
		});
		return previous;
	}

	async ensureUserInfos(id) {
		const general = await this.ensure(id);
		const cooldowns = await this.ensureCooldowns(id);
		const profile = await this.ensureProfile(id);
		const premium = await this.ensurePremium(id);
		return { general, cooldowns: cooldowns.cooldowns, profile: profile.profile, premium };
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
			return await this.profiles.create({
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

		return await this.profiles.update({
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
		return await this.profiles.update({
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