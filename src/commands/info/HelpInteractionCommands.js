const { InteractionCommand, Constants, Emotes } = require('../../');
const { MessageEmbed } = require('discord.js');
module.exports = class HelpInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'ajuda',
			description: 'Precisando de ajuda? veio ao lugar certo.',
			category: 'info',
			cooldown: 5,
		});
	}

	async run(ctx) {
		const embed = new MessageEmbed()
			.setColor(Constants.MITSY_COLOR)
			.setTitle(ctx.t('commands:help.embed_title', { mitsy_heart: Emotes.MITSY_HEART }))
			.setDescription(ctx.t('commands:help.embed_description', { user: ctx.data.author.id }))
			.setFooter(ctx.t('commands:help.embed_footer'));

		await ctx.makeMessage({ embeds: [embed], ephemeral: true });

	}
};
