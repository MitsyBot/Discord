const cache = new WeakMap();
const { StarboardManager } = require('../structures');

function getGuildUtilities(resolvable, client) {
	const guild = resolveGuild(resolvable, client);
	const previous = cache.get(guild);
	if (previous !== undefined) return previous;

	const entry = {
		starboard: new StarboardManager(guild, client),
	};
	cache.set(guild, entry);

	return entry;
}

function getProperty(property, client) {
	return (resolvable) => getGuildUtilities(resolvable, client)[property];
}

function resolveGuild(resolvable, client) {
	const guild = client.guilds.resolve(resolvable);
	if (guild === null) throw new TypeError(`${resolvable} resolved to null.`);

	return guild;
}

module.exports = { getProperty, resolveGuild, getGuildUtilities };