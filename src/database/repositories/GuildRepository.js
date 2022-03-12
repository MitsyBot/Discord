module.exports = class GuildRepository {
	constructor(connection) {
		this.general = connection.GuildConfig;
		this.keys = connection.DonationKeys;
	}
	async ensure(id) {
		const previous = await this.general.findUnique({ where: { id },
			include: {
				key: true,
			},
		});
		if (previous) return previous;

		const data = await this.general.create({ data: { id } });
		return data;
	}
};