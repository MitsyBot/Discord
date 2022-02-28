const Utils = require('../utils');

module.exports = class Connection {

	constructor(opts, client) {
		const options = Utils.createOptionHandler('Connection', opts);

		this.name = options.required('name');

		this.client = client;
	}

	canLoad() {
		return !!(this.client.database && process.env.WEBSITE_URL);
	}

	load() {
		return this;
	}

	get configPattern() {
		return {};
	}

	checkConfig([key, value]) {
		if (!this.configPattern[key]) return true;
		return this.configPattern[key](value);
	}

	get authCallbackURL() {
		return `${process.env.WEBSITE_URL}/connections/${this.name}/callback/`;
	}

	async callbackHandler(userID, code) {
		const tokens = await this.callback(code);
		const connect = await this.client.controllers.connection.connect(userID, this, tokens);
		return connect;
	}
};