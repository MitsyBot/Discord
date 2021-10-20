module.exports = {
	name: 'saldo',
	description: 'Mostra o seu saldo atual de cometinhas!',
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
		const userComets = data.user.coments ?? data.author.comets;

		interaction.editReply({
			content: `Você tem atualmente \`${userComets}\` cometinhas!`,
		});
	},
};
