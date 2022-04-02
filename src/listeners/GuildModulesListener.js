const { EventListener, MitsyEmbed } = require('../');

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
				.setTitle(`🤝 ${ban.user.username} foi desbanido(a)`)
				.setAuthor({ name: ban.user.username })
				.setFooter({ text: `ID do usuario: ${ban.user.id}` });

			channel.send({ embeds: [embed] });
		}
	}

	async onGuildBanRemove(ban) {
		const guild = await this.database.guild.ensure(ban.guild.id);
		if (guild.event_log.enabled && guild.event_log.member_unbanned) {
			const channel = await ban.guild.channels.cache.get(guild.event_log.event_log_channel);
			console.log(channel);
			const embed = new MitsyEmbed()
				.setTitle(`🤝 ${ban.user.username} foi desbanido(a)`)
				.setAuthor({ name: ban.user.username })
				.setFooter({ text: `ID do usuario: ${ban.user.id}` });

			channel.send({ embeds: [embed] });
		}
	}
};