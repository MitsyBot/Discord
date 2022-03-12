const Utils = require('../utils');

module.exports = class APIWrapper {
	constructor(opts) {
		const options = Utils.createOptionHandler('APIWrapper', opts);

		this.name = options.required('name');
		this.envVars = options.optional('envVars', []);
	}

	canLoad() {
		return true;
	}

	load() {
		return this;
	}
};