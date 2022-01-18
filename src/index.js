const CommandStructures = require('./structures/command');

module.exports = {
	CommandStructures,
	InteractionCommand: CommandStructures.InteractionCommand,
	InteractionCommandExecutor: CommandStructures.InteractionCommandExecutor,
	Loader: require('./structures/Loader.js'),
	EventListener: require('./structures/EventListener.js'),
	FileUtils: require('./utils/FileUtils.js'),
	HTTPrequests: require('./utils/HTTPrequests.js'),
	Constants: require('./utils/Constants.js'),
	Emotes: require('./utils/Emotes.js'),
	MitsyEmbed: require('./structures/MitsyEmbed.js'),
	WebSocketController: require('./websocket/ApiWebsocket'),
	Module: require('./structures/Module'),
	ApiUtils: require('./utils/ApiUtils'),
};