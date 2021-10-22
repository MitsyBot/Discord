const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'daily',
	description: 'Receba seu prêmio de cometinhas diário!',
	permissions: [''],
	/**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

	run: async (client, interaction, args, data) => {
		if (parseInt(data.author.timeDaily) > Date.now()) {
			return interaction.editReply({
				content: 'Você já resgatou seu prêmio diário!',
			});
		}

		let premiumBoost = 1;
		let tax = 0.2;

		if (data.author.isPremium) {
			premiumBoost = 0.5 + data.author.premiumLevel;
			tax = 1;
		}

		let amount = (Math.floor(Math.random() * 2000) + 2000) * premiumBoost;
		const taxValue = Math.floor(amount * tax);

		if (data.author.isPremium === false) {
			amount = amount - taxValue;
		}

		amount = Math.floor(amount);

		const embed = new MessageEmbed()
			.setColor('LUMINOUS_VIVID_PINK')
			.setDescription(
				`Yay! Você acaba de receber ${amount} cometinhas como seu prêmio diário!`,
			)
			.setFooter(
				`${interaction.user.username}`,
				interaction.user.displayAvatarURL(),
			)
			.setTimestamp();

		if (data.author.isPremium === false) {
			embed.addField(
				'Porém...',
				`Você teria recebido ${
					amount + taxValue
				} cometinhas se fosse premium! Isso acontece pois taxamos em 20% as transações para usuários não premium, esse dinheiro vai diretamente para a Mitsy e você pode ganhar devolta usando comandos de aposta contra ela! Sabemos que é chato, mas é uma forma da gente incentivar as pessoas a se tornarem premium e manter a Mitsy online.`,
			);
		}

		const authorData = await client.database.fetchUser(client.user.id);
		authorData.comets += taxValue;
		authorData.save();

		data.author.comets += amount;
		data.author.timeDaily = 43200000 + Date.now();
		data.author.save().then(() => {
			interaction.editReply({
				embeds: [embed],
			});
		});
	},
};
