const { canManage, flattenGuild } = require('../utils/Api/Utils');
const WebSocketController = async (mitsy, rawRequest) => {
	const { type, data, id } = JSON.parse(rawRequest.toString());

	switch (type) {
	case 'guild': {

		const guild = mitsy.client.guilds.cache.get(data.guildId);
		if (!guild) return mitsy.api.send(JSON.stringify({ id, res: 'Servidor não encontrado' }));
		const user = data.userId.toString();
		const member = await guild.members.fetch(user);
		if (!member) return mitsy.api.send(JSON.stringify({ id, res: 'O usuario que fez a request não foi encontrado no servidor' }));
		if (!(await canManage(guild, member))) return mitsy.api.send(JSON.stringify({ id, res: 'Você não pode gerenciar este servidor' }));

		guild.canManage = true;

		mitsy.api.send(JSON.stringify({ id, res: { ...flattenGuild(guild) } }));
		break;
	}

	case 'premiumbuy': {
		const message = `Oba, parece que você comprou ${data.ref} no valor de ${data.price}, Seu pagamento foi aprovado e seu premium ja esta ativado na sua conta! Agora você possui o mitsy premium tier ${data.tier}. divirta-se!`;
		const user = await mitsy.client.users.fetch(data.userid);
		console.log(user);
		user.send(message);
		mitsy.api.send(JSON.stringify({ id, res: { message: 'Enviado com sucesso' } }));
		break;
	}

	case 'authorizecon': {
		const connection = mitsy.client.connections[data.connection];
		if (!connection) return mitsy.api.send(JSON.stringify({ id, res: { error: 'Conexão não encontrada' } }));
		await connection.callbackHandler(data.userID, data.code);
		mitsy.api.send(JSON.stringify({ id, res: { success: true } }));
		break;
	}

	case 'common': {
		mitsy.api.send(JSON.stringify({ id, res: { common: mitsy.client.guilds.cache.has(data.guild) } }));
		break;
	}
	}
};

module.exports = WebSocketController;