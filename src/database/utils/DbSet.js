const { UserRepository, GuildRepository, BlacklistRepository, StarboardRepository } = require('../repositories/');
module.exports = class DbSet {

	constructor(connection) {
		this.connection = connection;
		this.donations = connection.UserDonations;
		this.keys = connection.DonationKeys;
		this.user = new UserRepository(connection);
		this.guild = new GuildRepository(connection);
		this.blacklist = new BlacklistRepository(connection);
		this.starboard = new StarboardRepository(connection);
		this.transactions = connection.CometTransaction;
	}
};