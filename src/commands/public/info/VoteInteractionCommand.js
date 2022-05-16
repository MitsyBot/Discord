const { InteractionCommand, MitsyEmbed } = require('../../../');
module.exports = class VoteInteractionCommands extends InteractionCommand {
	constructor() {
		super({
			name: 'suporte',
			description: 'Precisando de ajuda?',
			category: 'info',
			cooldown: 5,
		});
	}

	async run(ctx) {
		const embed = new MitsyEmbed(ctx.author)
			.setDescription(ctx.prettyResponse('MITSY_PLEAD', 'commands:vote.howToVote.dbl', { link: `https://top.gg/bot/${this.client.user.id}/vote` }));
		await ctx.makeMessage({ embeds: [embed] });
	}
};
