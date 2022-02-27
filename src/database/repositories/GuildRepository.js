module.exports = class GuildRepository {
	constructor(connection) {
		this.general = connection.GuildConfig;
	}
	async ensure(id) {
		const previous = await this.general.findUnique({ where: { id } });
		if (previous) return previous;

		const data = await this.general.create({ data: { id } });
		return data;
	}
};