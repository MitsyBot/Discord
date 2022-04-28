const { DevCommand } = require('../../');

module.exports = class BlacklistCommand extends DevCommand {
	constructor(client) {
		super({
			name: 'blacklist',
			permLevel: 'bodyguard',
		}, client);
	}

	async run(ctx) {
		if (!ctx.args[1]) return ctx.channel.send('Você precisa informar uma opção para a blacklist. Exemplo: `m!blacklist (remove ou add) (guild ou user) (@user | id do user | id da guild), motivo`');
		if (!ctx.args[2]) return ctx.channel.send('Você precisa informar um tipo para a blacklist. Exemplo: `m!blacklist (remove ou add) (guild ou user) (@user | id do user | id da guild), motivo`');

		const option = ctx.args[1].toLowerCase();
		const type = ctx.args[2].toLowerCase();
		const reason = ctx.args.slice(4).join(' ');
		const blacklister = ctx.message.author.tag;

		switch (option) {
		case 'add': {
			if (!ctx.args[3]) return ctx.channel.send('Você precisa informar um usuario para adicionar a blacklist. Exemplo: `m!blacklist (remove ou add) (guild ou user) @user, motivo`');
			if (!ctx.args[4]) return ctx.channel.send('Você precisa informar um motivo para adicionar a blacklist. Exemplo: `m!blacklist (remove ou add) (guild ou user) @user, motivo`');
			switch (type) {
			case 'guild': {
				const guild = ctx.args[3];
				ctx.client.controllers.developer.blacklistGuild(guild, reason);
				ctx.channel.send(`O servidor \`${guild}\` foi adicionado a blacklist por \`${blacklister}\`\nMotivo: ${reason}`);
				break;
			}
			case 'user': {
				const user = ctx.message.mentions.users.size ? ctx.message.mentions.users.first().id : ctx.args[3];
				ctx.client.controllers.developer.blacklistUser(user, reason, ctx.message.author.id);
				ctx.channel.send(`<@${user}> foi adicionado a blacklist por \`${blacklister}\`\nMotivo: ${reason}`);
				break;
			}
			default: {
				return ctx.channel.send('Você precisa informar um tipo para adicionar a blacklist. Exemplo: `m!blacklist (remove ou add) (guild ou user) (@user | id do user | id da guild), motivo`');
			}
			}
			break;
		}
		case 'remove': {
			if (!ctx.args[3]) return ctx.channel.send('Você precisa informar um usuario para remover da blacklist. Exemplo: `m!blacklist (remove ou add) (guild ou user) @user`');
			switch (type) {
			case 'guild': {
				const guild = ctx.args[3];
				ctx.client.controllers.developer.unblacklistGuild(guild);
				ctx.channel.send(`O servidor \`${guild}\` foi removido da blacklist por \`${blacklister}\``);
				break;
			}
			case 'user': {
				const user = ctx.message.mentions.users.size ? ctx.message.mentions.users.first().id : ctx.args[3];
				ctx.client.controllers.developer.unblacklistUser(user);
				ctx.channel.send(`<@${user}> foi removido da blacklist por \`${blacklister}\``);
				break;
			}
			default: {
				return ctx.channel.send('Você precisa informar um tipo para remover a blacklist. Exemplo: `m!blacklist (remove ou add) (guild ou user) (@user | id do user | id da guild)`');
			}
			}
		}
		}
	}
};