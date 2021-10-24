const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'soco',
	description: 'De um soco em um usuário!',
	options: [
		{
			name: 'usuário',
			type: 'USER',
			description: 'Mencione um usuário',
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
		axios({
			url: 'https://mitsy.website/api/v2/userinteraction/punch',
			method: 'GET',
		}).then(response => {
			const url = response.data.url;

			const embed = new MessageEmbed()
				.setDescription(`<@${data.author.id}> deu um soco em <@${data.user.id}>`)
				.setColor('DARK_VIVID_PINK')
				.setImage(url)
				.setFooter(
					`${interaction.user.username}`,
					interaction.user.displayAvatarURL(),
				)
				.setTimestamp();

			interaction.editReply({
				embeds: [embed],
			});
		});
	},
};
