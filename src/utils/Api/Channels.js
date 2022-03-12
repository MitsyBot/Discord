function isThreadChannel(channel) {
	return channel.isThread() ?? false;
}

function isDMChannel(channel) {
	return channel.type === 'DM';
}

function isGuildBasedChannelByGuildKey(channel) {
	return Reflect.has(channel ?? {}, 'guild');
}

function isNewsChannel(channel) {
	return channel.type === 'GUILD_NEWS';
}

function isTextChannel(channel) {
	return channel.type === 'GUILD_TEXT';
}

function isVoiceChannel(channel) {
	return channel.type === 'GUILD_VOICE';
}

module.exports = { isDMChannel, isGuildBasedChannelByGuildKey, isNewsChannel, isTextChannel, isThreadChannel, isVoiceChannel };