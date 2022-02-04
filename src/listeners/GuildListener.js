const { EventListener, MitsyEmbed, Constants } = require('../');

const Intl = require('intl');
Intl.__disableRegExpRestore();
const formatter = new Intl.NumberFormat('pt-BR');

module.exports = class GuildLogging extends EventListener {
	constructor(client) {
		super({
			events: ['guildCreate', 'guildDelete'],
		}, client);
	}

	onGuildCreate(guild) {
		this.logger.info({ tag: 'Guilds' }, `Adicionado a "${guild.name}" (${guild.id})`);
		if (process.env.LOGGING_CHANNEL_ID) {
			const channel = this.channels.cache.get(process.env.LOGGING_CHANNEL_ID);
			const embed = new MitsyEmbed()
				.setColor(Constants.GUILD_ADDED_COLOR)
				.setTitle(`Fui adicionada á "${guild.name}"`)
				.setDescription(`\`${guild.id}\``)
				.setFooter({ text: `Ganhamos ${formatter.format(guild.members.cache.size)} usuarios` });

			channel.send({ embeds: [embed] });

		}
	}

	onGuildDelete(guild) {
		this.logger.info({ tag: 'Guilds' }, `Removido de "${guild.name}" (${guild.id})`);
		if (process.env.LOGGING_CHANNEL_ID) {
			const channel = this.channels.cache.get(process.env.LOGGING_CHANNEL_ID);


			const embed = new MitsyEmbed()
				.setColor(Constants.GUILD_LOST_COLOR)
				.setTitle(`Fui removida de "${guild.name}"`)
				.setDescription(`\`${guild.id}\``)
				.setFooter({ text: `Perdemos ${formatter.format(guild.members.size)} usuarios` });

			channel.send({ embeds: [embed] });
		}
	}
};