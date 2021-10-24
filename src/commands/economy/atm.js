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
		const user = data.user ?? data.author;

		interaction.editReply({
			content: `Você tem atualmente \`${user.comets.toLocaleString('pt-BR', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}\` cometinhas!`,
		});
	},
};
