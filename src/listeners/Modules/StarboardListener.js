const { EventListener } = require('../../');

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

			const message = (await messageReaction.message.channel.messages.fetch(messageReaction.message.id).catch(() => null));
			if (!message) return null;

			const previous = await this.database.starboards.findOne({ where: { id: messageReaction.message.id } });

			if (previous) {
				await this.database.starboard.stars.update({
					where: {
						id: message.id,
					},
					data: {
						stars: previous.stars + 1,
					},
				});
				if (!previous.id) return null;
			}
			else {
				previous ?? await this.database.starboard.stars.create({
					data: {
						stars: 1,
						message: message.content,
						id: message.id,
						channel: message.channel.id,
						guild: message.guild.id,
						user: message.author.id,
					},
				});
			}
		}
	}
};