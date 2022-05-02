const { InteractionCommand, HTTPrequests, MitsyEmbed } = require('../../../');
const { MessageAttachment } = require('discord.js');

module.exports = class BotInfoInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'ship',
			description: 'Shippe duas pessoas para ver se elas combinam',
			options: [
				{
					name: 'user',
					type: 'USER',
					description: 'Primeiro usuário',
					required: true,
				},
				{
					name: 'user_dois',
					type: 'USER',
					description: 'Segundo usuário. Caso não seja passado, o ship será feito com você',
					required: false,
				},
			],
			category: 'fun',
			cooldown: 5,
		});
	}

	async run(ctx) {
		const user1 = ctx.options.getUser('user', true);
		const user2 = ctx.options.getUser('user_dois') ?? ctx.author;

		if (!user1) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:ship.unknow-user'),
				ephemeral: true,
			});
			return;
		}

		if (!user2) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:ship.unknow-user'),
				ephemeral: true,
			});
			return;
		}

		if (
			(await ctx.client.controllers.developer.userBlacklisted(user1.id)) === true ||
            (await ctx.client.controllers.developer.userBlacklisted(user2.id)) === true
		) {
			ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:ship.banned-user'),
				ephemeral: true,
			});
			return;
		}


		let percentage = (Number(user1.id) % 51) + (Number(user2.id) % 51) ;
		if (percentage > 100) percentage = 100 + '%';
		percentage = percentage.toString() + '%';

		let calculate = (Number(user1.id) % 51) + (Number(user2.id) % 51) ;
		if (calculate > 100) calculate = 100 + '%';

		let value = (Number(user1.id) % 140) + (Number(user2.id) % 140) + 1.6;
		if (calculate > 520) value = 520;

		const avatarLinkOne = user1.displayAvatarURL({ format: 'png', size: 256 });
		const avatarLinkTwo = user2.displayAvatarURL({ format: 'png', size: 256 });

		const image = await HTTPrequests.shipRequest(avatarLinkOne, avatarLinkTwo, value, percentage);

		const guild = ctx.interaction.guild ?? ctx.client.guilds.forge(ctx.interaction.guildId);

		const member1 = await guild.members.fetch(user1.id).catch(() => null);
		const member2 = await guild.members.fetch(user2.id).catch(() => null);

		const name1 = member1.nickname ?? user1.username;
		const name2 = member2.nickname ?? user2.username;

		const mix = `${
			name1.substring(0, name1.length / 2) + name2.substring(name2.length / 2, name2.length)
		}`.replace(' ', '');

		const embed = new MitsyEmbed()
			.setTitle(`${name1} + ${name2} = ${mix}`)
			.setDescription(
				`\n${ctx.locale('commands:ship.value')} **${percentage}**\n\n${ctx.locale(
					'commands:ship.default',
				)}`,
			);

		let attc;

		if (!image.err) {
			attc = new MessageAttachment(Buffer.from(image.data), 'ship.png');
			embed.setImage('attachment://ship.png');
		}
		else {embed.setFooter({ text: ctx.locale('common:http-error') });}

		if (calculate >= 25) {
			embed
				.setColor('#cadf2a')
				.setDescription(
					`\n${ctx.locale('commands:ship.value')} **${percentage}**\n\n${ctx.locale(
						'commands:ship.low',
					)}`,
				);
		}

		if (calculate >= 50) {
			embed
				.setColor('#d8937b')
				.setDescription(
					`\n${ctx.locale('commands:ship.value')} **${percentage}**\n\n${ctx.locale(
						'commands:ship.ok',
					)}`,
				);
		}

		if (calculate >= 75) {
			embed
				.setColor('#f34a4a')
				.setDescription(
					`\n${ctx.locale('commands:ship.value')} **${percentage}**\n\n${ctx.locale(
						'commands:ship.medium',
					)}`,
				);
		}

		if (calculate >= 99) {
			embed
				.setColor('#ec2c2c')
				.setDescription(
					`\n${ctx.locale('commands:ship.value')} **${percentage}**\n\n${ctx.locale(
						'commands:ship.high',
					)}`,
				);
		}

		if (calculate === 100) {
			embed
				.setColor('#ff00df')
				.setDescription(
					`\n${ctx.locale('commands:ship.value')} **${percentage}**\n\n${ctx.locale(
						'commands:ship.perfect',
					)}`,
				);
		}

		if (attc) {
			await ctx.makeMessage({
				content: `**${ctx.locale('commands:ship.message-start')}**`,
				embeds: [embed],
				files: [attc],
			});
		}
		else {
			await ctx.makeMessage({
				content: `**${ctx.locale('commands:ship.message-start')}**`,
				embeds: [embed],
			});
		}

	}
};