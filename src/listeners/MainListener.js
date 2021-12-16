const { EventListener, Mongodb } = require('../');

module.exports = class MainListener extends EventListener {
	constructor(client) {
		super({
			events: ['ready'],
		}, client);
	}

	onReady() {
		this.user.setActivity(`@${this.user.username} help`, { type: 'PLAYING' });
		Mongodb.connect();
	}
};