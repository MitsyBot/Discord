const client = require('../bot');

client.on('messageCreate', async (message) => {
	if (message.interaction) return;
	if (message.author.bot) return;

	const guildData = await client.database.fetchGuild(message.guild.id);
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

	const userData = await client.database.fetchUser(message.author.id);
	const xpBonus = 1 + userData.premiumLevel;
	const xpToLvlUp = userData.globalLevel * 1000;
	const xp = (Math.floor(Math.random() * 10) + 1) * xpBonus;

	userData.xp += xp;
	await userData.save();

	if (userData.xp >= xpToLvlUp) {
		userData.globalLevel += 1;
		await userData.save();
	}
});
