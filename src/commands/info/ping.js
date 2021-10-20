const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Mostra a latência atual da Mitsy!',
	permissions: [''],
	/**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

	run: async (client, interaction) => {
		const embed = new MessageEmbed()
			.setColor('LUMINOUS_VIVID_PINK')
			.setDescription(`:ping_pong: **WebSocket:** ${client.ws.ping}ms`)
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
