const { EventListener, Starboard } = require('../../');

module.exports = class MessageListener extends EventListener {
	constructor(client) {
		super({
			events: ['messageReactionAdd'],
		}, client);
	}

	async onMessageReactionAdd(messageReaction, user) {
		console.log(user);
		console.log(messageReaction.emoji);
		const emoji = messageReaction.emoji.id || messageReaction.emoji.name;
		if (!messageReaction.message.guild) return;

		const guild = await this.database.guild.ensure(messageReaction.message.guild.id);

		if (guild.starboard.enabled) {
			if (messageReaction.message.channel.nsfw) return;

			if (!(guild.starboard.starboard_channel || messageReaction.message.channel.id === guild.starboard.starboard_channel || emoji === guild.starboard.emoji)) return;

			const starboard = Starboard.getProperty('starboard', this);
			await starboard.fetch(messageReaction.message.channel, messageReaction.message.id);
		}
	}
};