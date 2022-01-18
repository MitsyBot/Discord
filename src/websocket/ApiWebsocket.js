const { Permissions } = require('discord.js');
const WebSocketController = async (mitsy, rawRequest) => {
	const { type, data, id } = JSON.parse(rawRequest.toString());

	function canManage(guild, member) {
		if (guild.ownerId === member.id) return true;
		if (member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return true;
	}

	switch (type) {
	case 'guild': {

		const guild = mitsy.client.guilds.cache.get(data.guildId);
		if (!guild) return mitsy.api.send(JSON.stringify({ id, res: 'Servidor não encontrado' }));

		const member = await guild.members.fetch(data.userId).catch(() => null);
		if (!member) return mitsy.api.send(JSON.stringify({ id, res: 'O usuario que fez a request não foi encontrado no servidor' }));
		console.log(member);
		if (!(await canManage(guild, member))) return mitsy.api.send(JSON.stringify({ id, res: 'Você não pode gerenciar este servidor' }));

		guild.canManage = true;

		mitsy.api.send(JSON.stringify({ id, res: guild }));
		break;
	}
	}
};

module.exports = WebSocketController;