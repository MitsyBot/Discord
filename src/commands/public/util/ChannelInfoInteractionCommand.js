const { InteractionCommand, MitsyEmbed } = require('../../../');

module.exports = class ChannelInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'canal',
			description: 'Veja informações sobre um canal do discord',
			category: 'util',
			options: [
				{
					name: 'canal',
					type: 'CHANNEL',
					usage: '/canal #updates',
					description: 'Escolha um canal',
					required: false,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const channel = ctx.options.getChannel('canal') ?? ctx.interaction.channel;
		console.log(channel.parentID);
		console.log(channel.guild);
		console.log(channel.guild.channels.cache.get(channel.parentID));
		console.log(parseInt(channel.createdAt / 1000).toFixed(0));
		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:channelinfo.title', { 0: channel.name }))
			.setDescription((channel.topic && channel.type !== 1) ? `\`\`\`${channel.topic}\`\`\`` : `\`${ctx.locale('commands:channelinfo.noTopic')}\``)
			.addField(ctx.locale('commands:channelinfo.mention'), `\`#${channel.name}\``, true)
			.addField(ctx.locale('commands:channelinfo.channelID'), `\`${channel.id}\``, true)
			.addField('NSFW', `\`${ctx.locale(`common:${channel.nsfw}`)}\``, true)
			.addField(ctx.locale('commands:channelinfo.guild'), `\`${channel.guild.name}\``, true)
			.addField(ctx.locale('commands:channelinfo.category'), `\`${channel.parent.name}\``, true)
			.addField(ctx.locale('commands:channelinfo.createdAt'), `<t:${parseInt(channel.createdAt / 1000).toFixed(0)}:F>`, true);

		await ctx.makeMessage({ embeds: [embed] });
	}
};