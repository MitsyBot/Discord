const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'botinfo',
	description: 'Mostra algumas informações sobre a Mitsy!',
	permissions: [''],
	/**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

	run: async (client, interaction) => {
		const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval((c) =>
				c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
			),
		];

		Promise.all(promises)
			.then((results) => {
				const totalGuilds = results[0].reduce(
					(acc, guildCount) => acc + guildCount,
					0,
				);
				const totalMembers = results[1].reduce(
					(acc, memberCount) => acc + memberCount,
					0,
				);
				const totalShards = client.options.shardCount;

				const embed = new MessageEmbed()
					.setTitle('Informações sobre a Mitsy!')
					.setColor('LUMINOUS_VIVID_PINK')
					.setThumbnail(client.user.displayAvatarURL())
					.addField('Servidores: ', `${totalGuilds}`, true)
					.addField('Usuários: ', `${totalMembers}`, true)
					.addField('Shards: ', `${totalShards}`)
					.setFooter(
						`${interaction.user.username}`,
						interaction.user.displayAvatarURL(),
					)
					.setTimestamp();

				interaction.editReply({
					embeds: [embed],
				});
			})
			.catch(console.error);
	},
};
