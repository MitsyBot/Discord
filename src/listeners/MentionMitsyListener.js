const { EventListener, MitsyEmbed } = require('../');

module.exports = class MessageListener extends EventListener {
	constructor(client) {
		super({
			events: ['messageCreate'],
		}, client);
	}

	async onMessageCreate(message) {
		const botMention = this.user.toString();
		const sw = (...s) => s.some(st => message.content.startsWith(st));
		const botmention = sw(botMention, `<@!${this.user.id}>`) ? `${botMention} ` : null;
		if (botmention) {
			const embed = new MitsyEmbed()
				.setDescription('Olá, pelo visto você me adicionou e não sabe como usar meus comandos não é mesmo? Ou você só quer saber se eu estou funcionando?\n\n**Bom presumindo que você não sabe usar meus comando:**\n\nEu uso **SlashCommands**, O que significa que para ver meus comandos é só digitar `/` bem ali onde você digita mensagens para enviar para os seus :sparkles: **friends** :sparkles:, Vão aparecer diversos comandos de diversos bots (caso eu não seja a unica que esteja no servidor, se eu for a unica quer dizer que minha missão foi concluida) ai é só usar um comando por exemplo /profile e procurar pelo comando que tem o meu avatar lindo ^-^\n\nEntendeu? Espero que sim, caso não tenha entendido recomendo ler meu faq em <https://mitsy.xyz/faq>');
			message.channel.send({ embeds: [embed] });
		}
	}
};