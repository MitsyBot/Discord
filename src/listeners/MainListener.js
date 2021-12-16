const { EventListener, Mongodb } = require('../');

module.exports = class MainListener extends EventListener {
	constructor(client) {
		super({
			events: ['ready'],
		}, client);
	}

	onReady() {
		Mongodb.connect();
	}
};