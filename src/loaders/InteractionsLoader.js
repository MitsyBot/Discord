const { Loader, YoutubeTogether } = require('../');

module.exports = class InteractionsLoader extends Loader {
	constructor(client) {
		super({
			preLoad: true,
		}, client);
	}

	async load() {
		try {
			this.client.youtubetogether = new YoutubeTogether(this.client);
			return true;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}
};