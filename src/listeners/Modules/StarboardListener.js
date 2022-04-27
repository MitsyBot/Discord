const { EventListener, MitsyEmbed } = require('../../');

module.exports = class MessageListener extends EventListener {
	constructor(client) {
		super({
			events: ['messageReactionAdd', 'messageReactionRemove'],
		}, client);
	}

	// eslint-disable-next-line no-unused-vars
	async onMessageReactionAdd(messageReaction, _user) {
		const emoji = messageReaction.emoji.id || messageReaction.emoji.name;
		if (!messageReaction.message.guild) return;


		const guild = await this.database.guild.ensure(messageReaction.message.guild.id);
		const channel = await messageReaction.message.guild.channels.cache.get(guild.starboard.starboard_channel);

		if (guild.starboard.enabled) {
			if (messageReaction.message.channel.nsfw) return;

			if (!(guild.starboard.starboard_channel || messageReaction.message.channel.id === guild.starboard.starboard_channel || emoji === guild.starboard.emoji)) return;

			const message = (await messageReaction.message.channel.messages.fetch(messageReaction.message.id).catch(() => null));
			if (!message) return null;

			const previous = await this.database.starboards.findUnique({ where: { id: messageReaction.message.id } });

			if (previous) {
				await this.database.starboards.update({
					where: {
						id: message.id,
					},
					data: {
						stars: previous.stars + 1,
					},
				});

				if (!previous.id) return null;

				const embed = new MitsyEmbed()
					.setAuthor({ name: messageReaction.message.member.user.username + '#' + messageReaction.message.member.user.discriminator })
					.setDescription(messageReaction.message.content);

				const dmessage = await channel.messages.fetch(previous.in_star_message);

				if (dmessage.id !== previous.in_star_message) {
					if (guild.starboard.required_stars < previous.stars) {
						const star_message = await channel.send({ content: `🌠 **1** - <#${messageReaction.message.channel.id}>`, embeds: [embed] });

						await this.database.starboards.update({
							where: {
								id: message.id,
							},
							data: {
								in_star_message: star_message.id,
							},
						});
					}
					return await channel.send({ content: `🌠 **${previous.stars + 1}** - <#${messageReaction.message.channel.id}>`, embeds: [embed] });
				}
				else {
					await dmessage.edit({ content: `🌠 **${previous.stars + 1}** - <#${messageReaction.message.channel.id}>`, embeds: [embed] });
				}
				return;
			}
			else {
				const stardata = await this.database.starboards.create({
					data: {
						stars: 1,
						message: message.content,
						id: message.id,
						channel: message.channel.id,
						guild: message.guild.id,
						user: message.author.id,
					},
				});
				if (guild.starboard.required_stars === stardata.stars) {
					const embed = new MitsyEmbed()
						.setAuthor({ name: messageReaction.message.member.user.username + '#' + messageReaction.message.member.user.discriminator })
						.setDescription(messageReaction.message.content);

					const star_message = await channel.send({ content: `🌠 **1** - <#${messageReaction.message.channel.id}>`, embeds: [embed] });

					await this.database.starboards.update({
						where: {
							id: message.id,
						},
						data: {
							in_star_message: star_message.id,
						},
					});
				}
			}
		}
	}

	// eslint-disable-next-line no-unused-vars
	async onMessageReactionRemove(messageReaction, _user) {
		const emoji = messageReaction.emoji.id || messageReaction.emoji.name;
		if (!messageReaction.message.guild) return;


		const guild = await this.database.guild.ensure(messageReaction.message.guild.id);
		const channel = await messageReaction.message.guild.channels.cache.get(guild.starboard.starboard_channel);


		if (guild.starboard.enabled) {
			if (messageReaction.message.channel.nsfw) return;

			if (!(guild.starboard.starboard_channel || messageReaction.message.channel.id === guild.starboard.starboard_channel || emoji === guild.starboard.emoji)) return;

			const message = (await messageReaction.message.channel.messages.fetch(messageReaction.message.id).catch(() => null));
			if (!message) return null;

			const previous = await this.database.starboards.findUnique({ where: { id: messageReaction.message.id } });

			if (previous) {
				const update = await this.database.starboards.update({
					where: {
						id: message.id,
					},
					data: {
						stars: previous.stars - 1,
					},
				});

				if (update.stars < 1) {
					await this.database.starboards.delete({
						where: {
							id: message.id,
						},
					});
				}
				console.log(update);
				if (update.stars < guild.starboard.required_stars) {
					const msg = await channel.messages.fetch(previous.in_star_message);
					await msg.delete();

				}

				if (!previous.id) return null;

				const embed = new MitsyEmbed()
					.setAuthor({ name: messageReaction.message.member.user.username + '#' + messageReaction.message.member.user.discriminator })
					.setDescription(messageReaction.message.content);

				const dmessage = await channel.messages.fetch(previous.in_star_message);

				if (dmessage.id !== previous.in_star_message) {

					const star_message = await channel.send({ content: `🌠 **1** - <#${messageReaction.message.channel.id}>`, embeds: [embed] });

					await this.database.starboards.update({
						where: {
							id: message.id,
						},
						data: {
							in_star_message: star_message.id,
						},
					});

					return await channel.send({ content: `🌠 **${previous.stars - 1}** - <#${messageReaction.message.channel.id}>`, embeds: [embed] });
				}
				else {
					await dmessage.edit({ content: `🌠 **${previous.stars - 1}** - <#${messageReaction.message.channel.id}>`, embeds: [embed] });
				}
				return;
			}
		}
	}
};