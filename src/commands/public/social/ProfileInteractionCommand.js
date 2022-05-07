const { InteractionCommand, HTTPrequests, Ranking } = require('../../../');
const { MessageAttachment } = require('discord.js');

module.exports = class ProfileInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'profile',
			description: 'Veja o seu perfil da mitsy.',
			category: 'social',
			options: [
				{
					name: 'usuário',
					type: 'USER',
					usage: '/profile Gio',
					description: 'Mencione um usuário',
					required: false,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {

		const user = ctx.data.user ?? ctx.data.author;
		const member = ctx.options.getUser('usuário') ?? ctx.author;
		const avatar = member.displayAvatarURL({ format: 'png', size: 512 });
		const marry = user.profile.married && user.profile.married !== 'false' ? await ctx.client.users.fetch(user.profile.married_user) : null;
		const previousLevel = Math.floor((user.profile.global_level - 1) * 1000);
		const nextLevel = Math.floor((user.profile.global_level + 1) * 1000);
		const progressBar = Math.max(Math.round(((user.profile.global_xp - previousLevel) / (nextLevel - previousLevel)) * 800), 6);
		const ranking = await Ranking.fetchGlobalRank(member, ctx.client);

		const data = {

			type: user.profile.active_profile_design,
			level: `${user.profile.global_level}`,
			name: `${member.username}#${member.discriminator}`,
			xp: `${user.profile.global_xp}`,
			ranking: ranking.toString(),
			barlevel: progressBar,
			money: `${user.profile.comets}`,
			aboutme: user.profile.aboutme,
			married: user.profile.married,
			bgId: user.profile.active_background,
			rep: `${user.profile.total_reps}`,
			favcolor: user.profile.color,
			avatarurl: avatar,
			badges: user.profile.active_badges,

		};
		if (marry) {
			data.partnername = marry.username;
		}
		const res = await HTTPrequests.profileRequest(data);

		if (res.err) {
			await ctx.makeMessage({ content: ctx.prettyResponse('error', 'error:http-imager') });
			return;
		}

		await ctx.makeMessage({
			files: [new MessageAttachment(res.data, 'profile.png')],
		});
	}
};
