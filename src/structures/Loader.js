const Utils = require('../utils');

module.exports = class Loader {
	constructor(opts, client) {
		const options = Utils.createOptionHandler('Loader', opts);

		this.critical = options.optional('critical', false);
		this.preLoad = options.optional('preLoad', false);

		this.client = client;
	}

	// eslint-disable-next-line no-unused-vars
	load(client) {
		return true;
	}
};