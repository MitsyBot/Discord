const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'raiva',
	description: 'Mostre sua raiva ao servidor',
	permissions: [''],
	/**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

	run: async (client, interaction, args, data) => {
		axios({
			url: 'https://mitsy.website/api/v2/userinteraction/angry',
			method: 'GET',
		}).then(response => {
			const url = response.data.url;

			const embed = new MessageEmbed()
				.setDescription(`<@${data.author.id}> se irritou.`)
				.setColor('#f895fb')
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