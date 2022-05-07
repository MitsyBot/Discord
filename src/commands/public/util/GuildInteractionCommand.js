const { InteractionCommand, MitsyEmbed } = require('../../../');

module.exports = class GuildInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'servidor',
			description: 'Veja informações do servidor.',
			category: 'util',
			options: [
				{
					type: 'SUB_COMMAND',
					name: 'banner',
					description: 'Mostra o banner do servidor',
				},
				{
					type: 'SUB_COMMAND',
					name: 'icon',
					description: 'Mostra o icone do servidor',
				},
				{
					type: 'SUB_COMMAND',
					name: 'info',
					description: 'Mostra informações do servidor',
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const imageType = ctx.options.getSubcommand();

		if (imageType === 'banner') return this.showBanner(ctx);
		if (imageType === 'icon') return this.showIcon(ctx);
		if (imageType === 'info') return this.guildInfo(ctx);
	}

	async showBanner(ctx) {
		const guild = ctx.interaction.guild;
		if (!guild.features.includes('BANNER')) return ctx.makeMessage({ content: ctx.prettyResponse('MITSY_STOP', 'commands:serverbanner.missingFeature') });
		if (!guild.banner) return ctx.makeMessage({ content: ctx.prettyResponse('MITSY_STOP', 'commands:serverbanner.missingBanner') });

		const embed = new MitsyEmbed()
			.setImage(guild.bannerURL())
			.setFooter(`©️ ${ctx.client.user.username}`)
			.setTimestamp();

		ctx.makeMessage({ embeds: [embed] });
	}

	async showIcon(ctx) {
		const guild = ctx.interaction.guild;
		if (!guild.icon) return ctx.makeMessage({ content: ctx.prettyResponse('MITSY_STOP', 'commands:servericon.missingIcon') });

		const embed = new MitsyEmbed()
			.setImage(guild.iconURL())
			.setTitle(`Icone de ${guild.name}`)
			.setFooter(`©️ ${ctx.client.user.username}`)
			.setTimestamp();

		ctx.makeMessage({ embeds: [embed] });
	}

	async guildInfo(ctx) {
		const guild = ctx.interaction.guild;
		const owner = await guild.fetchOwner();
		console.log(owner);
		const voiceChannel = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE');
		let membersInCall = 0;
		if (voiceChannel.length > 0) {
			for (const voice of voiceChannel) {
				membersInCall += voice.voiceMembers.size;
			}
		}
		const channelType = {
			text: Array.from(guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT')).length,
			voice: Array.from(guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE')).length,
		};

		const guildFeatures = [];
		if (guild.features.length > 0) {
			guild.features.forEach((features) => {
				guildFeatures.push(`${ctx.locale(`commands:serverinfo.features.${features}`)}`);
			});
		}

		const description = [
			`**${ctx.locale('commands:serverinfo.guildName')}:** ${guild.name} (\`${guild.id}\`)`,
			`**${ctx.locale('commands:serverinfo.guildOwner')}:** ${owner.user.tag} (\`${owner.id}\`)`,
			`**${ctx.locale('commands:serverinfo.guildAFKChannel.title')}:** ${guild.channels.cache.get(guild.afkChannelID) ? `${guild.channels.cache.get(guild.afkChannelID).name} (\`${guild.channels.cache.get(guild.afkChannelID).id}\`)` : ctx.locale('commands:serverinfo.guildAFKChannel.noAfkChannel')}`,
			`**${ctx.locale('commands:serverinfo.booster.levelCount')}:** ${guild.premiumTier} (${ctx.locale('commands:serverinfo.booster.boosterCount')}: ${guild.premiumSubscriptionCount})`,
			`**${ctx.locale('commands:serverinfo.guildMember')}:** ${guild.memberCount}`,
			`**${ctx.locale('commands:serverinfo.guildCreateAt')}:** <t:${parseInt(guild.createdAt / 1000).toFixed(0)}:F> (<t:${parseInt(guild.createdAt / 1000).toFixed(0)}:R>)`,
		];

		const embed = new MitsyEmbed()
			.setAuthor(guild.name, guild.icon ? guild.iconURL : 'https://http.cat/404')
			.setFooter(`Shard ID: ${guild.shard.id}/${ctx.client.shard.ids} • ${ctx.locale('commands:serverinfo.joinedAt')} ${new Date(ctx.interaction.guild.members.cache.get(ctx.client.user.id).joinedAt).toDateString()}`)
			.addField(ctx.locale('commands:serverinfo.general'), description.join('\n'))
			.addField(ctx.locale('commands:serverinfo.guildChannel.title', { 0: guild.channels.cache.size }), [
				`**${ctx.locale('commands:serverinfo.guildChannel.text')}:** ${channelType.text}`,
				`**${ctx.locale('commands:serverinfo.guildChannel.voice')}:** ${channelType.voice}`,
				`**${ctx.locale('commands:serverinfo.guildChannel.voiceMembers')}:** ${membersInCall}`,
			].join('\n'))
			.addField(ctx.locale('commands:serverinfo.features.title'), (guildFeatures.length > 0) ? guildFeatures.join(', ') : ctx.locale('commands:serverinfo.features.dontHave'));

		await ctx.makeMessage({ embeds: [embed] });
	}
};