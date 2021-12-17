const { InteractionCommand, Constants, Emotes } = require('../../');
const { MessageEmbed } = require('discord.js');
module.exports = class SupportInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'suporte',
			description: 'Precisando de ajuda?',
			category: 'info',
			defaultPermission: false,
			devsOnly: false,
			cooldown: 5,
			clientPermissions: ['EMBED_LINKS'],
		});
	}

	async run(ctx) {
		const embed = new MessageEmbed()
			.setColor(Constants.MITSY_COLOR)
			.setTitle(ctx.t('commands:support.embed_title', { mitsy_coffe: Emotes.MITSY_COFFE }))
			.setDescription(ctx.t('commands:support.embed_description', { user: ctx.data.author.id }))
			.setFooter(ctx.t('commands:support.embed_footer'));

		await ctx.makeMessage({ embeds: [embed], ephemeral: true });

	}
};
