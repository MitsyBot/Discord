const DevCommandContext = require('./DevCommandContext');

module.exports = class InteractionCommandExecutor {
	constructor(client, message) {
		client;
		message;
	}

	async CommandExecuted(client, message) {
		const DevLevel = await client.controllers.developer.getDeveloper(message.author.id);
		const prefix = 'm!';
		const sw = (...s) => s.some(st => message.content.startsWith(st));
		const usedPrefix = sw(prefix) ? prefix : null;
		const guildId = message.guild && message.guild.id;
		const fullCmd = message.content.substring(usedPrefix.length).split(/[ \t]+/).filter(a => a);
		const args = message.content.slice(prefix.length).trim().split(' ');
		const cmd = fullCmd[0].toLowerCase().trim();
		const command = client.devCommands.find(c => c.name.toLowerCase() === cmd);

		const ctx = new DevCommandContext({
			message,
			client,
			args,
			guildId,
		});
		console.log(DevLevel);
		if (DevLevel < 1) return ctx.channel.send('Você não tem permissão para usar este comando!');

		console.log(command);

		if (!command.run) return;

		await command.run(ctx).catch(async (error) => {
			if (error instanceof Error) {
				await ctx.channel.send(`${error.message}`);
			}
			else {
				await ctx.channel.send(`${error}`);
			}
		});
	}
};