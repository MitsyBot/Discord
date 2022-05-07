const { InteractionCommand, MitsyEmbed } = require('../../../');
const { MessageAttachment } = require('discord.js');
module.exports = class EmojiInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'emoji',
			description: 'Pegue o anexo de um emoji ou as informações dele',
			category: 'util',
			options: [
				{
					name: 'attach',
					description: 'Veja o anexo de um emoji',
					type: 'SUB_COMMAND',
					usage: '/emoji attach :mitsy_bugada:',
					options: [
						{
							name: 'emoji',
							type: 'STRING',
							usage: '/emoji :mitsy_bugada:',
							description: 'Mencione um emoji',
							required: true,
						},
					],
				},
				{
					name: 'info',
					description: 'Veja informações de um emoji',
					type: 'SUB_COMMAND',
					usage: '/emoji info :mitsy_bugada:',
					options: [
						{
							name: 'emoji',
							type: 'STRING',
							usage: '/emoji info :mitsy_bugada:',
							description: 'Veja informações de um emoji',
							required: true,
						},
					],
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const type = ctx.options.getSubcommand();
		if (type === 'info') return this.emojiInfo(ctx);

		const args = ctx.options.getString('emoji');
		const emoji = await ctx.getEmoji(args);
		if (!emoji) return ctx.makeMessage({ content: ctx.prettyResponse('MITSY_STOP', 'common:emojiInvalid') });

		const file = new MessageAttachment(emoji.url, `${emoji.name}.${emoji.animated ? 'gif' : 'png'}`);

		ctx.makeMessage({ files: [file] });
	}

	async emojiInfo(ctx) {
		const args = ctx.options.getString('emoji');
		const emoji = await ctx.getEmoji(args);
		if (!emoji) return ctx.makeMessage({ content: ctx.prettyResponse('MITSY_STOP', 'common:emojiInvalid') });

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:emojiinfo.embed.title'))
			.setThumbnail(emoji.url)
			.addField(ctx.locale('commands:emojiinfo.embed.name'), `\`${emoji.name}\``)
			.addField(ctx.locale('commands:emojiinfo.embed.id'), `\`${emoji.id}\``)
			.addField(ctx.locale('commands:emojiinfo.embed.mention'), `\`${emoji.mention}\``)
			.addField(ctx.locale('commands:emojiinfo.embed.url'), `[Clique aqui](${emoji.url})`);

		ctx.makeMessage({ embeds: [embed] });
	}
};