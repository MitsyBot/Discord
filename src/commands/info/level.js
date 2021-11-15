module.exports = {
	name: 'level',
	description: 'Mostra o nível de um usuário!',
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

		interaction.editReply({
			content: `${member.user.username} está nível ${user.level} com ${user.xp} de XP!`,
		});
	},
};
