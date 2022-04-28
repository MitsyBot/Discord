const {
	isDMChannel,
	isGuildBasedChannelByGuildKey,
	isNewsChannel,
	isTextChannel,
	isThreadChannel,
	isVoiceChannel,
} = require('./Channels');

function flattenChannelNews(channel) {
	return {
		id: channel.id,
		type: channel.type,
		guildId: channel.guild.id,
		name: channel.name,
		rawPosition: channel.rawPosition,
		parentId: channel.parentId,
		permissionOverwrites: [...channel.permissionOverwrites.cache.entries()],
		topic: channel.topic,
		nsfw: channel.nsfw,
		createdTimestamp: channel.createdTimestamp,
	};
}

function flattenChannelText(channel) {
	return {
		id: channel.id,
		type: channel.type,
		guildId: channel.guild.id,
		name: channel.name,
		rawPosition: channel.rawPosition,
		parentId: channel.parentId,
		permissionOverwrites: [...channel.permissionOverwrites.cache.entries()],
		topic: channel.topic,
		nsfw: channel.nsfw,
		rateLimitPerUser: channel.rateLimitPerUser,
		createdTimestamp: channel.createdTimestamp,
	};
}

function flattenChannelVoice(channel) {
	return {
		id: channel.id,
		type: channel.type,
		guildId: channel.guild.id,
		name: channel.name,
		rawPosition: channel.rawPosition,
		parentId: channel.parentId,
		permissionOverwrites: [...channel.permissionOverwrites.cache.entries()],
		bitrate: channel.bitrate,
		userLimit: channel.userLimit,
		createdTimestamp: channel.createdTimestamp,
	};
}

function flattenChannelGuild(channel) {
	return {
		id: channel.id,
		type: channel.type,
		guildId: channel.guild.id,
		name: channel.name,
		rawPosition: channel.rawPosition,
		parentId: channel.parentId,
		permissionOverwrites: [...channel.permissionOverwrites.cache.entries()],
		createdTimestamp: channel.createdTimestamp,
	};
}

function flattenChannelDM(channel) {
	return {
		id: channel.id,
		type: channel.type,
		recipient: channel.recipient.id,
		createdTimestamp: channel.createdTimestamp,
	};
}

function flattenChannelThread(channel) {
	return {
		id: channel.id,
		type: channel.type,
		archived: channel.archived ?? false,
		archivedTimestamp: channel.archiveTimestamp,
		createdTimestamp: channel.createdTimestamp,
		guildId: channel.guildId,
		name: channel.name,
		parentId: channel.parentId,
		permissionOverwrites: [...(channel.parent?.permissionOverwrites.cache.entries() ?? [])],
		rawPosition: channel.parent?.rawPosition ?? null,
		rateLimitPerUser: channel.rateLimitPerUser,
	};
}
function flattenChannelFallback(channel) {
	return {
		id: channel.id,
		type: channel.type,
		createdTimestamp: channel.createdTimestamp,
	};
}

function flattenChannel(channel) {
	if (isThreadChannel(channel)) return flattenChannelThread(channel);
	if (isNewsChannel(channel)) return flattenChannelNews(channel);
	if (isTextChannel(channel)) return flattenChannelText(channel);
	if (isVoiceChannel(channel)) return flattenChannelVoice(channel);
	if (isGuildBasedChannelByGuildKey(channel)) return flattenChannelGuild(channel);
	if (isDMChannel(channel)) return flattenChannelDM(channel);
	return flattenChannelFallback(channel);
}

function flattenRole(role) {
	return {
		id: role.id,
		guildId: role.guild.id,
		name: role.name,
		color: role.color,
		hoist: role.hoist,
		rawPosition: role.rawPosition,
		permissions: role.permissions.bitfield.toString(),
		managed: role.managed,
		mentionable: role.mentionable,
	};
}

function flattenEmoji(emoji) {
	return {
		id: emoji.id,
		animated: emoji.animated,
		name: emoji.name,
		url: emoji.url,
		identifier: emoji.identifier,
	};
}

module.exports = { flattenChannel, flattenRole, flattenEmoji };