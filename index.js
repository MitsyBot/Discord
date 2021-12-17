require('moment');
require('moment-duration-format');

const CLIENT_OPTIONS = {
	fetchAllMembers: false,
	enableEveryone: false,
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS',
	],
};

const MitsyClient = require('./src/MitsyClient.js');
const client = new MitsyClient(CLIENT_OPTIONS);

client.on('debug', (...args) => client.logger.info(...args));
client.on('rateLimit', (...args) => client.logger.info({ tag: 'rateLimit' }, ...args));

client.initialize();