const client = require('../bot');

client.on('messageCreate', async (message) => {
	if (message.interaction) return;

	const guildData = await client.database.fetchGuild(message.guild.id);
	const customCommands = guildData.customCommands;
	const blacklistedTerms = guildData.blacklistedTerms;
	const msg = message.content.split(' ');

	if (msg.some(v => v.includes(blacklistedTerms))) {
		return message.delete();
	}

	for (const cmd in customCommands) {
		if (message.content === customCommands[cmd][0]) {
			return message.reply(customCommands[cmd][1]);
		}
	}
});
