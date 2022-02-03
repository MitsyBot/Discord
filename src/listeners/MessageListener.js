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

		const userData = await this.database.users.findOne(message.author.id);
		const xpBonus = 1 + userData.premiumLevel;
		const xpToLvlUp = userData.globalLevel * 1000;
		const xp = (Math.floor(Math.random() * 10) + 1) * xpBonus;

		userData.xp += xp;

		if (userData.xp >= xpToLvlUp) {
			userData.globalLevel += 1;
		}
	}
};