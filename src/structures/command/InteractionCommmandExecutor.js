const InteractionCommandContext = require('./InteractionCommandContext');
module.exports = class InteractionCommandExecutor {
	constructor(client, interaction) {
		client;
		interaction;
	}

	async CommandExecuted(client, interaction) {
		const authorData = await client.database.fetchUser(interaction.user.id);
		const guildData = await client.database.fetchGuild(interaction.guild.id);

		const data = {};

		data.author = authorData;
		data.guild = guildData;

		const command = client.slashCommands.find(c => c.config.name === interaction.commandName);

		const t = client.i18next.getFixedT(data.guild.lang || 'pt-BR');

		if (!command) {
			interaction
				.reply({ content: t('errors:UNKNOWN_SLASH'), ephemeral: true });
			return;
		}


		if (data.guild.blacklist) {
			await interaction
				.reply({
					content: `${t('errors:GUILD_BLACKLISTED', {
						reason: data.guild.blacklistReason,
					})}`,
					ephemeral: true,
				}).then(() => {
					client.guilds.cache.get(data.guild.id)
						.leave()
						.then(g => client.logger.info({ tag: 'Discord' }, `Mitsy saiu de ${g} por ${data.guild.blacklistReason}`))
						.catch(console.error);
				});
			return;
		}

		const ctx = new InteractionCommandContext({
			interaction,
			t,
			client,
			data,
		});


		if (!command.run) return;

		await command.run(ctx).catch(async (error) => {
			client.logger.error(error);
		});
	}

};