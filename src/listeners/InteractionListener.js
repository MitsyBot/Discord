const { EventListener, InteractionCommandExecutor, MitsyEmbed } = require('../');
module.exports = class InteractionListener extends EventListener {
	constructor(client) {
		super({
			events: ['interactionCreate'],
		}, client);
	}

	async onInteractionCreate(interaction) {
		if (!interaction.isCommand() || !interaction.inGuild()) return;

		if (!interaction.channel.isText()) return;
		if (!this.loaded) return interaction.reply({ content: 'Ops, aparentemente eu ainda nao me conectei aos meus microserviços, aguarde alguns instantes' });

		if (!interaction.client.channels.cache.has(interaction.channelId)) {
			const channel = await interaction.client.channels
				.fetch(interaction.channelId);
			if (channel) {
				(interaction.client.channels.cache).forceSet(interaction.channelId, channel);
			}
		}

		if (process.env.LOGGING_CHANNEL_ID) {
			this.logger.info({ tag: 'Commands' }, `${interaction.user.tag} executou o comando "${interaction.commandName}" no servidor "${interaction.guild.name}" (${interaction.guild.id}) no canal "${interaction.channel.name.toString()}" (${interaction.channel.id}) `);
			const channel = this.channels.cache.get(process.env.LOGGING_CHANNEL_ID);
			const embed = new MitsyEmbed()
				.setTitle(`\`\`${interaction.user.tag}\`\` Executou um comando`)
				.setDescription(`**Comando:** \`\`"${interaction.commandName.toUpperCase()}"\`\`\n**Servidor:** \`\`"${interaction.guild.name}"\`\` \`\`(${interaction.guild.id})\`\`\n**Canal:** \`\`"${interaction.channel.name.toString()}"\`\` \`\`(${interaction.channel.id})\`\``)
				.setFooter({ text: 'Mitsy - Logger' });

			channel.send({ embeds: [embed] });
		}
		const executor = new InteractionCommandExecutor(this, interaction);
		executor.CommandExecuted(this, interaction);
	}
};