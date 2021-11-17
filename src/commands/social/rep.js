module.exports = {
	name: 'rep',
	description: 'Envia uma reputação para um usuário',
	options: [
		{
			name: 'usuario',
			type: 'USER',
			description: 'Digite o usuário para enviar a reputação',
			required: true,
		},
		{
			name: 'motivo',
			type: 'STRING',
			description: 'Digite o que motivou reputação!',
			required: true,
		},
	],
	permissions: [''],
	/**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

	run: async (client, interaction, args, data) => {
		const user = data.user;
		const author = data.author;

		if (!user) {
			interaction.editReply({
				content: 'usuario nao pode ser criado na db',
			});
		}

		if (user.id === interaction.user.id) {
			interaction.editReply({
				content: 'rep pra si mesmo',
			});
		}

		if (parseInt(author.repTime) > Date.now()) {
			interaction.editReply({
				content: 'ja pegou seu daily',
			});
		}

		const userTag = interaction.options._hoistedOptions[0].user.tag;
		const reason = args[1];
		const repLogMessageReceiver = `**Recebeu** uma reputação de \`${userTag}\` com o motivo \`${reason}\``;
		const repLogMessageSender = `**Enviou** uma reputação para \`${userTag}\` com o motivo \`${reason}\``;

		user.repLog.push(repLogMessageReceiver);
		author.repLog.push(repLogMessageSender);
		author.repTime = 7200000 + Date.now();
		user.repCount += 1;

		await user.save();
		await author.save();

		interaction.editReply({
			content: `Voce **enviou** uma reputação para <@${user.id}> com o motivo \`${reason}\``,
		});
	},
};
