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

	case 'getUser': {

		const user = await mitsy.client.users.fetch(data.user);
		mitsy.api.send(JSON.stringify({ id, res: user }));
		break;
	}

	case 'message': {
		const user = await mitsy.client.users.fetch(data.userid);
		user.send(data.message).catch(() => { mitsy.logger.error(`Could not send message to ${user.tag}`); });
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

	case 'getallcons': {
		const userConnections = await mitsy.client.controllers.connection.getConnectionsFiltered(data.userID);
		mitsy.api.send(JSON.stringify({ id, res: { userConnections } }));
		break;
	}

	case 'getresolvedguildname': {
		const guild = mitsy.client.guilds.cache.get(data.guildId);
		if (!guild) return mitsy.api.send(JSON.stringify({ id, res: 'Servidor não encontrado' }));
		mitsy.api.send(JSON.stringify({ id, res: { name: guild.displayName } }));
		break;
	}

	case 'removeconn': {
		await mitsy.client.controllers.connection.disconnectUser(data.userID, data.connection);
		mitsy.api.send(JSON.stringify({ id, res: { sucess: true } }));
		break;
	}
	}
};

module.exports = WebSocketController;