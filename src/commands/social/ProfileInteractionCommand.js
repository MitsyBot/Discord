const { InteractionCommand } = require('../../');
const { MessageAttachment } = require('discord.js');
const axios = require('axios');

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
		const previousLevel = Math.floor((user.level / 0.2) ** 2);
		const nextLevel = Math.floor(((user.level + 1) / 0.2) ** 2);
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

		axios({
			url: 'https://generator.poluxtrail.fun/render/profile',
			method: 'post',
			data: data,
			responseType: 'arraybuffer',
		}).then(async (profile) => {
			await ctx.makeMessage({
				files: [new MessageAttachment(profile.data, 'profile.png')],
			});
		});


	}
};
