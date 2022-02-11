const { EventListener } = require('../');

module.exports = class MessageListener extends EventListener {
	constructor(client) {
		super({
			events: ['messageCreate'],
		}, client);
	}

	async onMessageCreate(message) {
		if (message.interaction) return;
		if (message.author.bot) return;

		const guildData = await this.database.guilds.findOne(message.guild.id);
		const customCommands = guildData.customCommands;
		const blacklistedTerms = guildData.blacklistedTerms;
		const msg = message.content.split(' ');

		if (msg.some((v) => v.includes(blacklistedTerms))) {
			return message.delete();
		}

		for (const cmd in customCommands) {
			if (message.content === customCommands[cmd][0]) {
				return message.reply(customCommands[cmd][1]);
			}
		}

		this.controllers.social.addXp(message.author.id);
	}
};