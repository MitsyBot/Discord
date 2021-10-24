module.exports = {
	name: 'corfavorita',
	description: 'Altera a sua \'Cor favorita\' no seu perfil de usuário!',
	options: [
		{
			name: 'cor',
			type: 'STRING',
			description: 'Escreva sua nova \'Cor favorita\'!',
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
		const cor = args[0];
		if (!cor.startsWith('#')) {
			return interaction.editReply({
				content: 'Formato de cor inválida! A sua cor deve se parecer algo como: `#f750e8`',
			});
		}

		if (data.author.comets < 150) {
			return interaction.editReply({
				content: 'Você precisa de no mínimo `150` cometinhas para trocar sua cor favorita!',
			});
		}

		data.author.profileColor = cor;
		data.author.save();

		interaction.editReply({
			content: `Feito! Agora sua nova cor favorita é: \`${cor}\` `,
		});
	},
};
