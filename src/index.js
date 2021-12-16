const CommandStructures = require('./structures/command');

module.exports = {
	CommandStructures,
	InteractionCommand: CommandStructures.InteractionCommand,
	InteractionCommandExecutor: CommandStructures.InteractionCommandExecutor,
	Loader: require('./structures/Loader.js'),
	EventListener: require('./structures/EventListener.js'),
	FileUtils: require('./utils/FileUtils.js'),
	Mongodb: require('./database/mongodb'),
};