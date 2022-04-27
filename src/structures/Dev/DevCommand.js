const Utils = require('../utils');

module.exports = class Command {

	constructor(opts, client) {
		const options = Utils.createOptionHandler('Command', opts);

		this.name = options.required('name');
		this.permLevel = options.required('permission');
		this.client = client;

	}

	canLoad() {
		return true;
	}

	// eslint-disable-next-line no-empty-function
	async run() {}
};