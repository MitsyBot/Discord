const { EventListener } = require('../../');

module.exports = class MessageListener extends EventListener {
	constructor(client) {
		super({
			events: ['messageReactionAdd'],
		}, client);
	}

	async onMessageReactionAdd(messageReaction, user) {
		console.log(user);
		const emoji = messageReaction.emoji.id;
		if (!messageReaction.message.guild) return;

		const guild = await this.database.guild.ensure(messageReaction.message.guild.id);

		if (guild.starboard.enabled) {
			if (messageReaction.message.channel.nsfw) return;

			console.log(guild.starboard.starboard_channel);
			console.log(messageReaction.message.channel.id);
			console.log(guild.starboard.starboard_channel);
			console.log(emoji);
			console.log(guild.starboard.emoji);

			if (!guild.starboard.starboard_channel || messageReaction.message.channel.id === guild.starboard.starboard_channel || emoji === guild.starboard.emoji) return;

			console.log(emoji);
			console.log(messageReaction.message.content);
		}
	}
};