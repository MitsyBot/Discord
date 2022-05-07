const { InteractionCommand, MitsyEmbed, MiscUtils } = require('../../../');
const moment = require('moment');

module.exports = class UserInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'user',
			description: 'Informações do usuário.',
			category: 'util',
			options: [
				{
					type: 'SUB_COMMAND',
					name: 'avatar',
					description: 'Mostra o avatar do usuário',
					options: [
						{
							type: 'USER',
							name: 'user',
							description: 'Usuário para mostrar o avatar',
							required: false,
						},
						{
							type: 'BOOLEAN',
							name: 'servidor',
							description: 'Você quer ver o ícone do usuário neste servidor?',
							required: false,
						},
					],
				},
				{
					type: 'SUB_COMMAND',
					name: 'banner',
					description: 'Mostra o banner de alguém (Discord)',
					options: [
						{
							type: 'USER',
							name: 'user',
							description: 'Usuário para mostrar o banner',
							required: false,
						},
					],
				},
				{
					type: 'SUB_COMMAND',
					name: 'info',
					description: 'Mostra informações sobre um usuário (Discord)',
					options: [
						{
							type: 'USER',
							name: 'user',
							description: 'Usuário para mostrar as informações',
							required: false,
						},
					],
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const imageType = ctx.options.getSubcommand();

		if (imageType === 'banner') return this.showBanner(ctx);
		if (imageType === 'avatar') return this.showAvatar(ctx);
		if (imageType === 'info') return this.userInfo(ctx);
	}

	async userInfo(ctx) {
		moment.locale(ctx.data.author.general.locale);
		const member = ctx.options.getMember('usuário') ?? ctx.interaction.member;

		const embed = new MitsyEmbed()
			.setTitle(member.displayName)
			.setThumbnail(member.user.displayAvatarURL({ format: 'png' }))
			.addField(ctx.locale('commands:user.userinfo.tag'), member.user.tag, true)
			.addField(ctx.locale('commands:user.userinfo.id'), member.id, true)
			.addField(ctx.locale('commands:user.userinfo.createdAt'), `<t:${parseInt(member.user.createdTimestamp / 1000).toFixed(0)}:F>`, true)
			.addField(ctx.locale('commands:user.userinfo.joinedAt'), `<t:${parseInt(member.joinedTimestamp / 1000).toFixed(0)}:F>`, true)
			.setFooter(`${ctx.author.tag} - ${ctx.locale('commands:user.userinfo.memberNumber', { count: MiscUtils.formatNumber(Array.from(ctx.interaction.guild.members.cache.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)).indexOf(member) + 1, ctx.data.author.general.locale) })}`);

		await ctx.makeMessage({ embeds: [embed] });
	}

	async showAvatar(ctx) {
		const fromServer = ctx.options.getBoolean('servidor', false);

		const user =
          (fromServer ? ctx.options.getMember('user', false) : ctx.options.getUser('user')) ??
          ctx.author;

		const username = user ? user.username : user.username;

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:user.title', { user: username }))
			.setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
			.setColor(ctx.data.author.profile.color)
			.setFooter({ text: ctx.locale('commands:user.footer') });

		if (user.id === ctx.client.user?.id) {
			embed.setTitle(ctx.locale('commands:user.client_title', { user: username }));
			embed.setColor('#f276f3');
			embed.setFooter({ text: ctx.locale('commands:user.client_footer') });
		}

		await ctx.makeMessage({ embeds: [embed] });
	}

	async showBanner(ctx) {
		const user = await ctx.options.getUser('user') ?? ctx.author;
		if (!user.banner) {
			ctx.makeMessage({
				content: ctx.prettyResponse('MITSY_COFFE', 'commands:user.banner.no-banner'),
				ephemeral: true,
			});
			return;
		}
		const userBanner = await ctx.client.users.fetch(user.id).catch((e) => ctx.client.logger.error(e));
		const bannerUrl = await userBanner.bannerURL({ dynamic: true, size: 1024 });

		if (!userBanner || !bannerUrl) {
			ctx.makeMessage({
				content: ctx.prettyResponse('MITSY_COFFE', 'commands:user.banner.no-banner'),
				ephemeral: true,
			});
			return;
		}

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:user.banner.title', { user: user.username }))
			.setImage(bannerUrl)
			.setColor(ctx.data.author.profile.color)
			.setFooter({ text: ctx.locale('commands:user.banner.footer') });

		await ctx.makeMessage({ embeds: [embed] });
	}
};