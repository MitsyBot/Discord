const { DevCommand } = require('../../');

module.exports = class BlacklistCommand extends DevCommand {
	constructor(client) {
		super({
			name: 'remove',
			permLevel: 'bodyguard',
		}, client);
	}

	async run(ctx) {
		try {
			const user = ctx.message.mentions.users.first().id;
			const role = ctx.message.guild.roles.cache.find(grole => grole.name === '@everyone');

			user.roles.remove(role);
		}
		catch (e) {
			console.log(e);
		}
	}
};