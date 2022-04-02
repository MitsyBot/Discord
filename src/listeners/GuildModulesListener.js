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
					.setDescription(`📝 **Nickname de ${newMember.user.username} foi alterado**\n**Antigo nickname:** \`${oldMember.nickname}\`\n**Novo nickname:** \`${newMember.nickname}\``)
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
};