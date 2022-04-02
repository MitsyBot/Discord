module.exports = class EventLog {
	static async send(channel, embed, client) {
		client.logger.info('MITSY BACKEND', `Procurando um webhook da mitsy em ${channel.id}`);

		if (!channel.permissionsFor(client.user).has('MANAGE_WEBHOOKS')) {
			client.logger.info('MITSY BACKEND', 'O cliente não tem permissões suficientes para verificar se o webhook existe');
			return;
		}

		const webhooks = await channel.fetchWebhooks();
		let webhook = await webhooks.find(wh => wh.name === 'MITSY - BASE HOOK');

		if (!webhook) {
			client.logger.info('MITSY BACKEND', `Nenhum webhook da mitsy existe em ${channel.id}, criando um novo webhook!`);

			webhook = await channel.createWebhook('MITSY - BASE HOOK', {
				avatar: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`,
			});
		}

		await webhook.send({
			username: 'Mitsy - Logs',
			avatarURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`,
			embeds: [embed],
		});
	}

};

