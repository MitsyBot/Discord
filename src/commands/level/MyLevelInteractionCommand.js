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
			.setTitle(ctx.locale('commands:level.embed_title', { mitsy_heart: Emotes.emotes.MITSY_HEART }))
			.setDescription(ctx.locale('commands:level.embed_description', { mitsy_confetti:Emotes.emotes.MITSY_CONFETTI, username: member.user.username, level: user.profile.global_level, xp: user.profile.global_xp }))
			.setFooter(ctx.locale('commands:level.embed_footer'));

		await ctx.makeMessage({ embeds: [embed], ephemeral: false });

	}
};
