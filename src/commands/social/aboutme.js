module.exports = {
	name: 'sobremim',
	description: 'Altera o seu \'Sobre mim\' no seu perfil de usuário!',
	options: [
		{
			name: 'texto',
			type: 'STRING',
			description: 'Escreva seu novo \'Sobre mim\'!',
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
		const text = args[0];
		if (text.length > 128) {
			return interaction.editReply({
				content: 'A sua biografia é muito grande!',
			});
		}

		const bio = text.replace(/[`]/g, '');
		data.author.aboutme = bio;
		data.author.save();

		interaction.editReply({
			content: `Feito! Agora seu novo *sobre mim* é: \`${bio}\` `,
		});
	},
};
