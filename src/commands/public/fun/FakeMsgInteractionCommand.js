const { InteractionCommand } = require('../../../');

module.exports = class FakemsgInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'fakemsg',
			description: 'Finja ser um usuário e faça uma prank com todos hahaha muito bom',
			category: 'fun',
			options: [
				{
					name: 'usuario',
					type: 'USER',
					usage: '/fakemsg @Loritta a mitsy é incrivel',
					description: 'Selecione um usuario',
					required: true,
				},
				{
					name: 'texto',
					type: 'STRING',
					usage: '/fakemsg @Loritta a mitsy é incrivel',
					description: 'Escreva uma mensagem supimpa',
					required: true,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const member = await ctx.options.getUser('usuario');
		if (!member) return ctx.replyT('error', 'basic:invalidUser');
		const args = await ctx.options.getString('texto');
		if (!args) return ctx.replyT('error', 'commands:fakemsg.argsNull');
		let webhook = await ctx.interaction.channel.fetchWebhooks();
		console.log(webhook);
		webhook = webhook.filter(webhooked => webhooked.name === 'Fake Message' && webhooked.owner.id === ctx.client.user.id)[0];
		if (!webhook) {
			webhook = await ctx.interaction.channel.createWebhook('Fake Message');
		}

		webhook.send({
			content: args,
			avatarURL: member.avatarURL(),
			username: member.username,
			allowedMentions: {
				everyone: false,
				roles: false,
			},
		});

		ctx.makeMessage({ content: 'owo' }).then(msg => msg.delete());
	}
};