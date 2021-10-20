const fs = require('fs');

/**
 * @param {Client} client
 */

module.exports = (client) => {
	try {
		const arrayOfCommands = [];
		let cmds;

		fs.readdirSync('./commands').forEach((cmd) => {
			const commands = fs
				.readdirSync(`./commands/${cmd}/`)
				.filter((file) => file.endsWith('.js'));
			for (cmds of commands) {
				const pull = require(`../commands/${cmd}/${cmds}`);
				if (pull.name) {
					client.commands.set(pull.name, pull);
					arrayOfCommands.push(pull);
				}
				else {
					continue;
				}
			}
			client.on('ready', async () => {
				client.guilds.cache.forEach(async (g) => {
					await client.guilds.cache.get(g.id).commands.set(arrayOfCommands);
				});
			});
		});
	}
	catch (err) {
		console.log(err);
	}
};
