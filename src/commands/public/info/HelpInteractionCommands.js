const { InteractionCommand, MitsyEmbed, Emotes } = require('../../../');
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
		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:help.embed_title', { mitsy_heart: Emotes.MITSY_HEART }))
			.setDescription(ctx.locale('commands:help.embed_description', { user: ctx.author.id }))
			.setFooter(ctx.locale('commands:help.embed_footer'));

		await ctx.makeMessage({ embeds: [embed], ephemeral: true });

	}
};
