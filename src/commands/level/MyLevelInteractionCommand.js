const { InteractionCommand, MitsyEmbed, Emotes } = require('../../');
module.exports = class LevelInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'level',
			description: 'Verifique seu nivel ou o de um usuario especifico.',
			category: 'level',
			options: [
				{
					name: 'usuário',
					type: 'USER',
					description: 'Mencione um usuário',
					required: false,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {

		const user = ctx.data.user ?? ctx.data.author;
		const member = ctx.interaction.guild.members.cache.get(user.id);

		const embed = new MitsyEmbed()
			.setTitle(ctx.t('commands:level.embed_title', { mitsy_heart: Emotes.MITSY_HEART }))
			.setDescription(ctx.t('commands:level.embed_description', { mitsy_confetti:Emotes.MITSY_CONFETTI, username: member.user.username, level: user.level, xp: user.xp }))
			.setFooter(ctx.t('commands:level.embed_footer'));

		await ctx.makeMessage({ embeds: [embed], ephemeral: false });

	}
};
