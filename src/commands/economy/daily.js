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

		if (data.author.isPremium) {
			premiumBoost = 0.5 + data.author.premiumLevel;
		}

		const amount = (Math.floor(Math.random() * 2000) + 2000) * premiumBoost;

		data.author.comets += amount;
		data.author.timeDaily = 43200000 + Date.now();
		data.author.save().then(() => {
			interaction.editReply({
				content: `Você recebeu seu prêmio no daily! ${amount}`,
			});
		});
	},
};
