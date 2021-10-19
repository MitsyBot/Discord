const client = require('../bot');

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		await interaction.deferReply({ ephemeral: false }).catch();

		const cmd = client.commands.get(interaction.commandName);
		if (!cmd) return;

		const args = [];

		for (const option of interaction.options.data) {
			if (option.type === 'SUB_COMMAND') {
				if (option.name) args.push(option.name);
				option.options?.forEach((x) => {
					if (x.value) args.push(x.value);
				});
			}
			else if (option.value) {args.push(option.value);}
		}

		interaction.member = interaction.guild.members.cache.get(interaction.user.id);

		if (cmd) {
			cmd.run(client, interaction, args);
		}
	}

	if (interaction.isContextMenu()) {
		await interaction.deferReply({ ephemeral: false });
		const command = client.commands.get(interaction.commandName);
		if (command) command.run(client, interaction);
	}
});