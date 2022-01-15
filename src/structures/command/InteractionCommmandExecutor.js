const InteractionCommandContext = require('./InteractionCommandContext');
const { Collection } = require('discord.js');
module.exports = class InteractionCommandExecutor {
	constructor(client, interaction) {
		client;
		interaction;
	}

	async CommandExecuted(client, interaction) {
		const authorData = await client.database.users.findOne(interaction.user.id);
		const guildData = await client.database.guilds.findOne(interaction.guild.id);

		const data = {};

		if (interaction.options.getUser('usuário', false)) {
			const interactionUserData = await client.database.users.findOne(interaction.options.getUser('usuário', false));
			data.user = interactionUserData;
		}

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
					ephemeral: false,
				}).then(() => {
					client.guilds.cache.get(data.guild.id)
						.leave()
						.then(g => client.logger.info({ tag: 'Discord' }, `Mitsy saiu de ${g} por ${data.guild.blacklistReason}`))
						.catch(console.error);
				});
			return;
		}

		if (data.author.blacklist) {
			await interaction
				.reply({
					content: t('errors:USER_BLACKLISTED', { reason: data.author.blacklisted.reason }),
					ephemeral: true,
				});
			return;
		}

		if (command.config.devsOnly && data.author.staffLevel < 3) {
			await interaction.reply({ content: t('permissions:ONLY_DEVS'), ephemeral: true });
			return;
		}

		if (command.config.staffOnly && data.author.staffLevel < 2) {
			await interaction.reply({ content: t('permissions:ONLY_STAFF'), ephemeral: true });
			return;
		}

		if (command.config.clientPermissions) {
			const clientMember = interaction.guild.members.cache.get(
				client.user.id,
			);
			const missing = interaction.channel
				.permissionsFor(clientMember)
				.missing(command.config.clientPermissions);
			if (missing?.length) {
				const perm = missing.map((value) => t(`permissions:${value}`)).join(', ');
				await interaction
					.reply({
						content: t('permissions:CLIENT_MISSING_PERMISSION', {
							perm,
						}),
						ephemeral: true,
					});
				return;
			}
		}

		if (command.config.userPermissions) {
			const member = interaction.member
				? interaction.member
				: await (await client.guilds.fetch(interaction.guildId)).members.fetch(interaction.user.id);
			const missing = interaction.channel
				?.permissionsFor(member)
				?.missing(command.config.userPermissions);
			if (missing?.length) {
				const perm = missing.map((value) => t(`permissions:${value}`)).join(', ');
				await interaction
					.reply({
						content: t('permissions:USER_MISSING_PERMISSION', {
							perm,
						}),
						ephemeral: true,
					});
				return;
			}
		}

		if (!client.cooldowns.has(command.config.name)) {client.cooldowns.set(command.config.name, new Collection());}

		const now = Date.now();
		const timestamps = client.cooldowns.get(command.config.name);
		const cooldownAmount = (command.config.cooldown || 3) * 1000;

		if (now - interaction.createdTimestamp >= 3000) return;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = (timestamps.get(interaction.user.id)) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				await interaction
					.reply({
						content: t('events:cooldown', {
							time: timeLeft.toFixed(2),
							cmd: command.config.name,
						}),
						ephemeral: true,
					});
				return;
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => {
			timestamps.delete(interaction.user.id);
		}, cooldownAmount);


		const ctx = new InteractionCommandContext({
			interaction,
			t,
			client,
			data,
		});


		if (!command.run) return;

		await command.run(ctx).catch(async (error) => {
			interaction.reply(t('errors:COMMAND', { error: error })),
			client.logger.error(error);
		});

		if (client.maintenance.enabled) {
			await interaction.followUp({ content: t('common:MAINTENANCE', { hour: client.maintenance.time }), ephemeral: true });
		}

		if (!data.author.isPremium && Math.random() < 0.7) {
			await interaction.followUp({ content: t('common:NOT_PREMIUM'), ephemeral: true });
		}
	}

};