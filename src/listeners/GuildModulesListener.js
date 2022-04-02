const { EventListener, MitsyEmbed, EventLog } = require('../');

module.exports = class EventLogger extends EventListener {
	constructor(client) {
		super({
			events: ['guildBanAdd', 'guildBanRemove', 'guildMemberUpdate', 'messageUpdate', 'voiceStateUpdate'],
		}, client);
	}

	async onGuildBanAdd(ban) {
		const guild = await this.database.guild.ensure(ban.guild.id);
		if (guild.event_log.enabled && guild.event_log.member_banned) {
			const channel = ban.guild.channels.cache.get(guild.event_log.event_log_channel);

			const embed = new MitsyEmbed()
				.setDescription(`🚫 **${ban.user.username} foi banido(a)**`)
				.setAuthor({ name: ban.user.username + '#' + ban.user.discriminator })
				.setFooter({ text: `ID do usuario: ${ban.user.id}` });

			await EventLog.send(channel, embed, this);
		}
	}

	async onGuildBanRemove(ban) {
		const guild = await this.database.guild.ensure(ban.guild.id);
		if (guild.event_log.enabled && guild.event_log.member_unbanned) {
			const channel = await ban.guild.channels.cache.get(guild.event_log.event_log_channel);

			const embed = new MitsyEmbed()
				.setDescription(`🤝 **${ban.user.username} foi desbanido(a)**`)
				.setAuthor({ name: ban.user.username + '#' + ban.user.discriminator })
				.setFooter({ text: `ID do usuario: ${ban.user.id}` });

			await EventLog.send(channel, embed, this);
		}
	}

	async onGuildMemberUpdate(oldMember, newMember) {
		const guild = await this.database.guild.ensure(newMember.guild.id);
		const channel = await newMember.guild.channels.cache.get(guild.event_log.event_log_channel);

		if (guild.event_log.enabled) {

			if (guild.event_log.nickname_changes && oldMember.nickname !== newMember.nickname) {
				const embed = new MitsyEmbed()
					.setAuthor({ name: newMember.user.username + '#' + newMember.user.discriminator })
					.setDescription(`📝 **Nickname de ${newMember.user.username} foi alterado**\n\n**Antigo nickname:** \`${oldMember.nickname}\`\n**Novo nickname:** \`${newMember.nickname}\``)
					.setFooter({ text: `ID do usuario: ${newMember.user.id}` });
				await EventLog.send(channel, embed, this);
			}


			if (guild.event_log.avatar_changes && oldMember.avatar !== newMember.avatar) {
				this.logger.info('MITSY BACKEND', 'Enviando imagens de avatar para o servidor de imagens');

				const embed = new MitsyEmbed()
					.setAuthor({ name: newMember.user.username + '#' + newMember.user.discriminator })
					.setDescription(`📝 **O avatar de ${newMember.user.username} foi alterado**`)
					.setFooter({ text: `ID do usuario: ${newMember.user.id}` });
				await EventLog.send(channel, embed, this);
			}
		}
	}

	async onMessageUpdate(oldMessage, newMessage) {
		const guild = await this.database.guild.ensure(newMessage.guild.id);
		const channel = await newMessage.guild.channels.cache.get(guild.event_log.event_log_channel);

		if (guild.event_log.enabled) {
			if (newMessage.channel.isText() && oldMessage.deleted && guild.event_log.message_deleted) {
				const embed = new MitsyEmbed()
					.setAuthor({ name: newMessage.author.username + '#' + newMessage.author.discriminator })
					.setDescription(`📝 **Mensagem de texto deletada**\n\n**Canal de texto:** <#${newMessage.channel.id}>\n\n**Mensagem:**\n\n\`\`\`${oldMessage.content}\`\`\``)
					.setFooter({ text: `ID do usuario: ${newMessage.author.id}` });
				await EventLog.send(channel, embed, this);
			}
		}


		if (guild.event_log.enabled) {
			if (newMessage.channel.isText() && newMessage.content !== oldMessage.content && guild.event_log.message_edited) {
				const embed = new MitsyEmbed()
					.setAuthor({ name: newMessage.author.username + '#' + newMessage.author.discriminator })
					.setDescription(`📝 **<@${newMessage.author.id}> Editou uma mensagem de texto**\n\n**Canal de texto:** <#${newMessage.channel.id}>\n\n**Mensagem antiga:**\n\n\`\`\`${oldMessage.content}\`\`\`\n\n**Nova mensagem:**\n\n\`\`\`${newMessage.content}\`\`\``)
					.setFooter({ text: `ID do usuario: ${newMessage.author.id}` });
				await EventLog.send(channel, embed, this);
			}
		}
	}
};