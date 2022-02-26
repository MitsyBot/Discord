const { connect } = require('../database.config');

module.exports = class DbSet {

	constructor(connection) {
		this.connection = connection;
	}

	static async connect() {
		return (DbSet.instance ??= await (DbSet.connectPromise ??= connect().then((connection) => {
			DbSet.connectPromise = null;
			return new DbSet(connection);
		})));
	}
};