const { UserRepository, GuildRepository } = require('../repositories/');
module.exports = class DbSet {

	constructor(connection) {
		this.connection = connection;
		this.user = new UserRepository(connection);
		this.guild = new GuildRepository(connection);
	}
};