module.exports = {
	name: 'staff',
	description: 'Mostra se um usuário faz parte da equipe oficial da Mitsy e o seu cargo!',
	options: [
		{
			name: 'usuário',
			type: 'USER',
			description: 'Mencione um usuário',
			required: false,
		},
	],
	permissions: [''],
	/**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

	run: async (client, interaction, args, data) => {
		const user = data.user ?? data.author;
		const member = interaction.guild.members.cache.get(user.id);

		let bool;
		if (user.isStaff) {
			bool = 'é membro da equipe oficial da Mitsy!';
		}
		else {
			bool = 'não é membro da equipe oficial da Mitsy!';
		}

		let staffLevel;

		switch (user.staffLevel) {
		case 0:
			staffLevel = bool;
			break;
		case 1:
			staffLevel = `${bool} - Designer!`;
			break;
		case 2:
			staffLevel = `${bool} - Suporte da Mitsy!`;
			break;
		case 3:
			staffLevel = `${bool} - Desenvolvedor!`;
			break;
		case 4:
			staffLevel = `${bool} - Criador da Mitsy!`;
		}

		interaction.editReply({
			content: `${member.user.username} ${staffLevel}`,
		});
	},
};
