const { InteractionCommand, Constants, Emotes } = require('../../');
const { MessageEmbed } = require('discord.js');
module.exports = class HelpInteractionCommand extends InteractionCommand {
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
			defaultPermission: false,
			devsOnly: false,
			cooldown: 5,
			clientPermissions: ['EMBED_LINKS'],
		});
	}

	async run(ctx) {

		const user = ctx.data.user ?? ctx.data.author;
		const member = ctx.interaction.guild.members.cache.get(user.id);

		const embed = new MessageEmbed()
			.setColor(Constants.MITSY_COLOR)
			.setTitle(ctx.t('commands:level.embed_title', { mitsy_heart: Emotes.MITSY_HEART }))
			.setDescription(ctx.t('commands:level.embed_description', { mitsy_confetti:Emotes.MITSY_CONFETTI, username: member.user.username, level: user.level, xp: user.xp }))
			.setFooter(ctx.t('commands:level.embed_footer'));

		await ctx.makeMessage({ embeds: [embed], ephemeral: false });

	}
};
