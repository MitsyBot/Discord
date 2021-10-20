const fs = require('fs');

/**
 * @param {Client} client
 */

module.exports = (client) => {
	try {
		fs.readdirSync('./events/').forEach(() => {
			const events = fs
				.readdirSync('./events/')
				.filter((file) => file.endsWith('.js'));
			for (const file of events) {
				const pull = require(`../events/${file}`);
				if (pull.name) {
					client.events.set(pull.name, pull);
				}
			}
		});
	}
	catch (err) {
		console.log(err);
	}
};
