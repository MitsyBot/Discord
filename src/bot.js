const { Client, Collection, Intents } = require('discord.js');

const fs = require('fs');

const client = new Client({
	intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
});

module.exports = client;

const config = require('./utils/config.json');
const token = config.token;

client.commands = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.categories = fs.readdirSync('./commands/');

['events', 'commands'].forEach((handler) => {
	require(`./handlers/${handler}`)(client);
});

client.login(token);