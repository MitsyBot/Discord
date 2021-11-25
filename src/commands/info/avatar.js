const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'avatar',
	description: 'Mostra o avatar de algum usuário!',
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

	run: async (client, interaction, args) => {
		const user = args[0] ?? interaction.user.id;
		const member = interaction.guild.members.cache.get(user);
		const avatarUrl = member.user.displayAvatarURL({
			dynamic: true,
			size: 1024,
		});
		const embed = new MessageEmbed()
			.setAuthor(`Avatar de ${member.user.username}`)
			.setDescription(`Para baixar essa imagem [clique aqui](${avatarUrl})`)
			.setColor('#f895fb')
			.setImage(avatarUrl)
			.setFooter(
				`${interaction.user.username}`,
				interaction.user.displayAvatarURL(),
			)
			.setTimestamp();

		interaction.editReply({
			embeds: [embed],
		});
	},
};
