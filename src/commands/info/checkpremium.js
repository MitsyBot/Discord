module.exports = {
	name: 'premium',
	description: 'Mostra se um usuário é premium e o seu plano premium!',
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
		if (user.isPremium) {
			bool = 'é um usuário premium';
		}
		else {
			bool = 'não é um usuário premium';
		}

		interaction.editReply({
			content: `${member.user.username} ${bool} (${user.premiumLevel}x)!`,
		});
	},
};
