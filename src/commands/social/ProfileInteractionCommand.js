const { InteractionCommand, HTTPrequests } = require('../../');
const { MessageAttachment } = require('discord.js');

module.exports = class LevelInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'profile',
			description: 'Veja o seu perfil da mitsy.',
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
		const member = ctx.options.getUser('user') ?? ctx.author;
		const avatar = member.displayAvatarURL({ format: 'png', size: 512 });
		const marry = user.isMarry && user.isMarry !== 'false' ? await ctx.client.users.fetch(user.marryWith) : null;
		const previousLevel = Math.floor((user.level - 1) * 1000);
		console.log(previousLevel);
		const nextLevel = Math.floor((user.level + 1) * 1000);
		console.log(nextLevel);
		const progressBar = Math.max(Math.round(((user.xp - previousLevel) / (nextLevel - previousLevel)) * 396), 6);


		const data = {

			type: 'default',
			level: `${user.level}`,
			name: `${member.username}#${member.discriminator}`,
			xp: `${user.xp}`,
			ranking: '4',
			barlevel: progressBar,
			money: `${user.comets}`,
			aboutme: user.aboutme,
			married: user.isMarry,
			bgId: user.background,
			rep: `${user.repCount}`,
			favcolor: user.profileColor,
			avatarurl: avatar,
			badges: [],

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
