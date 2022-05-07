const { InteractionCommand, MitsyEmbed } = require('../../../');
const axios = require('axios');
module.exports = class ChannelInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'minecraft',
			description: 'Comandos relacionados ao minecraft',
			category: 'minecraft',
			options: [
				{
					type: 'SUB_COMMAND',
					name: 'avatar',
					description: 'Mostra o avatar de um usuario do minecraft',
					options: [
						{
							name: 'nickname',
							type: 'STRING',
							usage: '/minecraft avatar SonBane',
							description: 'Escreva um usuario do minecraft',
							required: true,
						},
					],
				},
				{
					type: 'SUB_COMMAND',
					name: 'body',
					description: 'Mostra a skin de um usuario do minecraft montada',
					options: [
						{
							name: 'nickname',
							type: 'STRING',
							usage: '/minecraft avatar duuuuardo',
							description: 'Escreva um usuario do minecraft',
							required: true,
						},
					],
				},
				{
					type: 'SUB_COMMAND',
					name: 'servidor',
					description: 'Mostra o status de um servidor de minecraft',
					options: [
						{
							name: 'ip',
							type: 'STRING',
							usage: '/minecraft server play.shinycomet.net',
							description: 'Escreva o ip do servidor',
							required: true,
						},
					],
				},
				{
					type: 'SUB_COMMAND',
					name: 'skin',
					description: 'Mostra a skin de um usuario do minecraft desmontada',
					options: [
						{
							name: 'nickname',
							type: 'STRING',
							usage: '/minecraft avatar duuuuardo',
							description: 'Escreva um usuario do minecraft',
							required: true,
						},
					],
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const imageType = ctx.options.getSubcommand();

		if (imageType === 'avatar') return this.mcAvatar(ctx);
		if (imageType === 'body') return this.mcBody(ctx);
		if (imageType === 'servidor') return this.mcServer(ctx);
		if (imageType === 'skin') return this.mcSkin(ctx);
	}

	async mcAvatar(ctx) {
		const body = `https://mc-heads.net/avatar/${ctx.options.getString('nickname')}/256.png`;
		const embed = new MitsyEmbed()
			.setImage(body)
			.setDescription(`[[Baixar]](${body})`)
			.setFooter(`©️ ${ctx.client.user.username}`)
			.setTimestamp();

		ctx.makeMessage({ embeds: [embed] });
	}

	async mcBody(ctx) {
		const body = `https://mc-heads.net/body/${ctx.options.getString('nickname')}`;
		const embed = new MitsyEmbed()
			.setImage(body)
			.setDescription(`[[Baixar]](${body})`)
			.setFooter(`©️ ${ctx.client.user.username}`)
			.setTimestamp();

		ctx.makeMessage({ embeds: [embed] });
	}

	async mcServer(ctx) {
		const body = await axios.get(`${encodeURI(`https://api.mcsrvstat.us/2/${ctx.options.getString('ip')}`)}`, { responseType: 'json' });
		const mcserver = body.data;
		if (mcserver.online) {
			const embed = new MitsyEmbed()
				.setTitle(`${mcserver.hostname}`)
				.setDescription(mcserver.motd.clean.join('\n'))
				.setFooter(`©️ ${ctx.client.user.username}`)
				.setTimestamp()
				.addField('Players', `${mcserver.players.online}/${mcserver.players.max}`)
				.addField(ctx.locale('commands:mcquery.version'), mcserver.version);

			ctx.makeMessage({ embeds: [embed] });
		}
		else {
			return ctx.makeMessage({ content: ctx.prettyResponse('MITSY_STOP', 'commands:mcquery.serverOffline', { 0: ctx.options.getString('ip') }) });
		}
	}

	async mcSkin(ctx) {
		const body = `https://minotar.net/skin/${ctx.options.getString('nickname')}`;
		const embed = new MitsyEmbed()
			.setImage(body)
			.setDescription(`[[Baixar]](${body})`)
			.setFooter(`©️ ${ctx.client.user.username}`)
			.setTimestamp();

		ctx.makeMessage({ embeds: [embed] });
	}

};