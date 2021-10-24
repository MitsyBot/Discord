const client = require('../bot');

client.on('interactionCreate', async (interaction) => {
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
			else if (option.value) {
				args.push(option.value);
			}
		}

		interaction.member = interaction.guild.members.cache.get(
			interaction.user.id,
		);

		const authorData = await client.database.fetchUser(interaction.user.id);
		const guildData = await client.database.fetchGuild(interaction.guild.id);

		const data = {};

		data.author = authorData;
		data.guild = guildData;
		data.user = null;

		const cmdOptions = interaction.options._hoistedOptions[0];

		if (cmdOptions && cmdOptions.type === 'USER') {
			const userData = await client.database.fetchUser(interaction.options._hoistedOptions[0].user.id);
			data.user = userData;
		}

		if (cmd) {
			cmd.run(client, interaction, args, data);
		}
	}

	if (interaction.isContextMenu()) {
		await interaction.deferReply({ ephemeral: false });
		const command = client.commands.get(interaction.commandName);
		if (command) command.run(client, interaction);
	}
});
