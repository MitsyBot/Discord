const CommandStructures = require('./structures/command');

module.exports = {
	CommandStructures,
	InteractionCommand: CommandStructures.InteractionCommand,
	InteractionCommandExecutor: CommandStructures.InteractionCommandExecutor,
	Loader: require('./structures/Loader.js'),
	EventListener: require('./structures/EventListener.js'),
	FileUtils: require('./utils/FileUtils.js'),
	HTTPrequests: require('./utils/HTTPrequests.js'),
	APIWrapper: require('./structures/APIWrapper'),
	Constants: require('./utils/Constants.js'),
	Emotes: require('./utils/Emotes.js'),
	Controller: require('./structures/Controller.js'),
	MitsyEmbed: require('./structures/MitsyEmbed.js'),
	WebSocketController: require('./websocket/ApiWebsocket'),
	MiscUtils: require('./utils/MiscUtils'),
	EventLog: require('./utils/EventLog'),
	Connection: require('./structures/Connetion'),
	YoutubeTogether: require('./media/interactions/Youtube'),
};