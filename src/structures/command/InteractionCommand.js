/* eslint-disable no-empty-function */
module.exports = class InteractionCommand {
	constructor(config) {
		this.config = { ...config, authorDataFields: config.authorDataFields ?? [] };
	}

	canLoad() {
		return true;
	}

	// eslint-disable-next-line no-unused-vars
	async run(ctx) {}
};