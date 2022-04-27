const { DevCommand } = require('../../');

module.exports = class BlacklistCommand extends DevCommand {
	constructor(client) {
		super({
			name: 'blacklist',
			permLevel: 'bodyguard',
		}, client);
	}

	async run(ctx) {
		if (!ctx.args.length < 2) return ctx.channel.send('Você precisa informar um usuário para adicionar a blacklist. Exemplo: `m!blacklist @user, motivo (Use `,`para separar os argumentos)`');
		if (!ctx.args[0]) return ctx.channel.send('Você precisa informar um usuário para adicionar a blacklist. Exemplo: `m!blacklist (guild ou user) (@user | id do user | id da guild), motivo (Use `,`para separar os argumentos)`');
		if (!ctx.args[1]) return ctx.channel.send('Você precisa informar um motivo para adicionar a blacklist. Exemplo: `m!blacklist @user, motivo (Use `,`para separar os argumentos)`');
		if (!ctx.args[2]) return ctx.channel.send('Você precisa informar um motivo para adicionar a blacklist. Exemplo: `m!blacklist @user, motivo (Use `,`para separar os argumentos)`');

		const type = ctx.args[0];
		const id = ctx.args[1];
		const reason = ctx.args[2];

		switch (type) {
		case 'guild': {
			console.log('guild');
			break;
		}
		case 'user': {
			console.log('user');
			break;
		}
		default: {
			return ctx.channel.send('Você precisa informar um tipo para adicionar a blacklist. Exemplo: `m!blacklist (guild ou user) (@user | id do user | id da guild), motivo (Use `,`para separar os argumentos)`');
		}
		}

		console.log('Passou aqui');
		ctx.channel.send('Verifica o console aew');
	}
};