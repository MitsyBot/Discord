const WebSocketController = async (mitsy, socket, rawRequest) => {
	const { type, data, id } = JSON.parse(rawRequest.toString());

	switch (type) {
	case 'guild': {

		const guild = mitsy.client.guilds.cache.get(data.guildId);
		if (guild) {
			const { name, icon, members: { size } } = guild;
			const userMembers = Array.from(guild.members).filter(m => !m.user.bot).size;
			const botMembers = size - userMembers;
			const newdata = { id: guild.id, name, icon, totalMembers: size, userMembers, botMembers };
			return socket.send(JSON.stringify({ id, newdata }));
		}
		socket.send(JSON.stringify({ id, error: 'Servidor não encontrado' }));
		break;
	}
	}
};

module.exports = WebSocketController;