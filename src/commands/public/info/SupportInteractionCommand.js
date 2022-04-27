const { InteractionCommand, MitsyEmbed, Emotes } = require('../../');
module.exports = class SupportInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'suporte',
			description: 'Precisando de ajuda?',
			category: 'info',
			cooldown: 5,
		});
	}

	async run(ctx) {
		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:support.embed_title', { mitsy_coffe: Emotes.emotes.MITSY_COFFE }))
			.setDescription(ctx.locale('commands:support.embed_description', { user: ctx.author.id }))
			.setFooter(ctx.locale('commands:support.embed_footer'));

		await ctx.makeMessage({ embeds: [embed], ephemeral: true });

	}
};
