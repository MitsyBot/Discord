const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'cara-ou-coroa',
	// eslint-disable-next-line quotes
	description:
    'Jogue uma partida de cara ou coroa contra, quem desafia é sempre \'cara\'!',
	options: [
		{
			name: 'usuário',
			type: 'USER',
			description: 'Mencione um usuário',
			required: true,
		},
		{
			name: 'aposta',
			type: 'NUMBER',
			description: 'Coloque o valor da sua aposta',
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
		const bet = args[1];
		if (bet > 10000 || bet < 50) {
			return interaction.editReply({
				content: 'As apostas devem ser entre 50 e 10,000 cometinhas!',
			});
		}

		const guildMember = interaction.guild.members.cache.get(args[0]);
		if (guildMember.user.bot && guildMember.user.id !== client.user.id) {
			return interaction.editReply({
				content:
          'Você não pode jogar com outros robôs! Mas você pode jogar comigo ou jogar sem fazer nenhuma aposta com outros usuários!',
			});
		}

		if (data.author.comets < bet || data.user.comets < bet) {
			return interaction.editReply({
				content:
          'A aposta é muito alta para um dos usuários! Verifique o saldo com `/saldo`.',
			});
		}

		const author = data.author;
		const member = data.user;

		if (author.id === member.id) {
			return interaction.editReply({
				content: 'Você não pode jogar consigo mesmo!',
			});
		}

		const possibleEvents = ['cara', 'coroa'];
		const event =
      possibleEvents[Math.floor(Math.random() * possibleEvents.length)];

		let winnerEvent;

		if (event === 'cara') {
			winnerEvent = author;
		}
		else {
			winnerEvent = member;
		}

		if (bet > 1) {
			if (member.id !== client.user.id) {
				const row = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('accept-coinflip')
						.setLabel('Aceitar')
						.setStyle('SUCCESS'),
				);

				interaction.editReply({
					content: 'aoba',
					components: [row],
				});

				// Desafio com aposta contra outro usuário foi aceito
				client.on('interactionCreate', (res) => {
					if (!res.isButton()) return;
					if (res.customId !== 'accept-coinflip') return;
					if (res.user.id !== member.id) return;

					if (event === 'cara') {
						data.author.comets += bet;
						data.user.comets -= bet;
					}
					else {
						data.author.comets -= bet;
						data.user.comets += bet;
					}

					data.author.save();
					data.user.save();

					return interaction.editReply({
						content: `E o resultado é **${event}**! O vencedor é <@${winnerEvent.id}> e ganhou ${bet} pela aposta`,
					});
				});
			}
			else {

				// Desafio com aposta contra a Mitsy!
				if (event === 'cara') {
					data.author.comets += bet;
					data.user.comets -= bet;
				}
				else {
					data.author.comets -= bet;
					data.user.comets += bet;
				}

				data.author.save();
				data.user.save();

				return interaction.editReply({
					content: `E o resultado é **${event}**! O vencedor é <@${winnerEvent.id}> e ganhou ${bet} pela aposta`,
				});
			}
		}

		// Desafio sem aposta contra outro usuário ou a Mitsy!
		else {
			return interaction.editReply({
				content: `E o resultado é **${event}**! O vencedor é <@${winnerEvent.id}>`,
			});
		}
	},
};
