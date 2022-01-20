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

	case 'common': {
		mitsy.api.send(JSON.stringify({ id, res: { common: mitsy.client.guilds.cache.has(data.guild) } }));
	}
	}
};

module.exports = WebSocketController;