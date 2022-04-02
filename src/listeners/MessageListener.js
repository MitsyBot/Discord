const { EventListener } = require('../');

module.exports = class MessageListener extends EventListener {
	constructor(client) {
		super({
			events: ['messageCreate'],
		}, client);
	}

	async onMessageCreate(message) {
		if (message.author.bot || !this.loaded) return;
		if (message.interaction) return;

		const guildData = await this.database.guild.ensure(message.guild.id);
		const customCommands = guildData.general.custom_commands;

		for (const cmd in customCommands) {
			if (message.content === customCommands[cmd][0]) {
				return message.reply(customCommands[cmd][1]);
			}
		}

		this.controllers.social.addXp(message.author.id);
	}
};