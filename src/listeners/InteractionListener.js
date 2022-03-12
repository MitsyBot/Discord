const { EventListener, InteractionCommandExecutor } = require('../');
module.exports = class InteractionListener extends EventListener {
	constructor(client) {
		super({
			events: ['interactionCreate'],
		}, client);
	}

	async onInteractionCreate(interaction) {
		if (!interaction.isCommand() || !interaction.inGuild()) return;
		const t = this.i18next.getFixedT('pt-BR');

		if (!interaction.channel?.isText()) return;
		if (!this.loaded) return interaction.reply({ content: t('errors:BOT_LOADING') });

		if (!interaction.client.channels.cache.has(interaction.channelId)) {
			const channel = await interaction.client.channels
				.fetch(interaction.channelId);
			if (channel) {
				(interaction.client.channels.cache).forceSet(interaction.channelId, channel);
			}
		}
		const executor = new InteractionCommandExecutor(this, interaction);
		executor.CommandExecuted(this, interaction);
	}
};