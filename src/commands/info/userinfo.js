const { MessageEmbed } = require('discord.js');

const moment = require('moment');

module.exports = {
	name: 'userinfo',
	description: 'Mostra as informações de um usuário!',
	options: [{
		name: 'usuário',
		type: 'USER',
		description: 'Mencione um usuário',
		required: false,
	}],
	permissions : [''],
	/**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

	run: async (client, interaction, args) => {
		const user = args[0] ?? interaction.user.id;
		const member = interaction.guild.members.cache.get(user);

		const timestamp = member.user.createdTimestamp;
		const createdAt = moment(timestamp).locale('pt').format('LL');

		const embed = new MessageEmbed()
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setColor('DARK_VIVID_PINK')
			.addField('Criado em: ', `${createdAt}`)
			.setFooter(`${interaction.user.username}`, interaction.user.displayAvatarURL())
			.setTimestamp();

		interaction.editReply({
			embeds: [embed],
		});
	},
};