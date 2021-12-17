const { EventListener } = require('../');

module.exports = class MainListener extends EventListener {
	constructor(client) {
		super({
			events: ['ready'],
		}, client);
	}

	onReady() {
		console.log('passou aqui');
	}
};