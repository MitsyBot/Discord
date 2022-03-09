const InteractionCommandContext = require('./InteractionCommandContext');
const { Collection } = require('discord.js');
const { MitsyEmbed } = require('../');
module.exports = class InteractionCommandExecutor {
	constructor(client, interaction) {
		client;
		interaction;
	}

	async CommandExecuted(client, interaction) {
		const authorData = await client.database.user.ensureUserInfos(interaction.user.id);
		const guildData = await client.database.guild.ensure(interaction.guild.id);

		const data = {};
		const user = interaction.options.getUser('usuário', false);
		if (user) {
			const interactionUserData = await client.database.user.ensureUserInfos(user.id);
			data.user = interactionUserData;
		}
		const userBlacklist = await client.controllers.developer.userBlacklisted(interaction.user.id);
		const guildBlacklist = await client.controllers.developer.guildBlacklisted(interaction.guild.id);

		const DevLevel = await client.controllers.developer.getDeveloper(interaction.user.id);

		data.author = authorData;
		data.guild = guildData;

		const command = client.slashCommands.find(c => c.config.name === interaction.commandName);

		const t = client.i18next.getFixedT(data.guild.lang || 'pt-BR');

		if (!command) {
			interaction
				.reply({ content: t('errors:UNKNOWN_SLASH'), ephemeral: true });
			return;
		}

		if (guildBlacklist) {
			await interaction
				.reply({
					content: `${t('errors:GUILD_BLACKLISTED', {
						reason: data.guild.blacklistReason,
					})}`,
					ephemeral: false,
				}).then(() => {
					client.guilds.cache.get(data.guild.general.id)
						.leave()
						.then(g => client.logger.info({ tag: 'Discord' }, `Mitsy saiu de ${g} por ${data.guild.blacklistReason}`))
						.catch(console.error);
				});
			return;
		}
		if (userBlacklist) {
			await interaction
				.reply({
					content: t('errors:USER_BLACKLISTED', { reason: userBlacklist.reason }),
					ephemeral: true,
				});
			return;
		}

		if (data.guild.blacklisted_channels.includes(interaction.channelId) && DevLevel < 1) {
			if (!data.guild.blacklistedChannels.warn) return;

			await interaction.reply({ content: t('errors:CHANNEL_BLACKLISTED'), ephemeral: true });
			return;
		}


		if (command.config.devsOnly && DevLevel < 3) {
			await interaction.reply({ content: t('permissions:ONLY_DEVS'), ephemeral: true });
			return;
		}

		if (command.config.staffOnly && DevLevel < 2) {
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

		const guild_has_premium = !!(await client.database.keys.count({
			where: {
			  active_in: interaction.guild.id
			},
		  }));

		  const user_has_premium = !!(await client.database.keys.count({
			where: {
			  active_in: interaction.guild.id
			},
		  }));

		if (command.config.name === 'music') {
			if((guild_has_premium && data.guild.key.tier < 4) || (user_has_premium && data.user.premium.tier < 3)) {
				// o servidor ou o usuario nao tem premium tier suficiente para usar este comando
				return t('errors:MUSIC_PREMIUM_WITHOUT_TIER')
			}
			if((!guild_has_premium) || (!user_has_premium)) {
				// o servidor ou o usuario nao tem premium
				return t('errors:MUSIC_NO_PREMIUM')
			}
		}

		if (command.config.category === 'economy') {client.commandExecutions.add(ctx.author.id);}

		await command.run(ctx).catch(async (error) => {
			const errorWebHook = await client.fetchWebhook(
				process.env.BUG_HOOK_ID,
				process.env.BUG_HOOK_TOKEN,
			);

			if (interaction.deferred) {
				interaction.webhook
					.send({ content: t('errors:COMMAND', { error: error }), ephemeral: true });
			}
			else {
				interaction
					.reply({ content: t('errors:COMMAND', { error: error }), ephemeral: true });
			}

			if (error instanceof Error && error.stack) {
				const errorMessage = error.stack.length > 1800 ? `${error.stack.slice(0, 1800)}...` : error.stack;
				const embed = new MitsyEmbed();
				embed.setColor('#fd0000');
				embed.setTitle('Ocorreu um erro');
				embed.setDescription(`\`\`\`js\n${errorMessage}\`\`\``);
				embed.addField('Quem fez isso?', `ID de usuario: \`${interaction.user.id}\` \nServidor: \`${interaction.guild.id}\``, true);
				embed.setTimestamp();
				errorWebHook.send({ embeds: [embed] });
			}
		}).finally(() => {
			if (command.config.category === 'economy') {client.commandExecutions.delete(ctx.author.id);}
		});

		if (client.maintenance.enabled) {
			await interaction.webhook.send({ content: t('common:MAINTENANCE', { hour: client.maintenance.time }), ephemeral: true });
		}

		if (!data.author.isPremium && Math.random() < 0.2) {
			interaction.webhook.send({ content: t('common:NOT_PREMIUM'), ephemeral: true });
		}
	}

};