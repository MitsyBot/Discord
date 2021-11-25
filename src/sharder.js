const { ShardingManager } = require('discord.js');
const chalk = require('chalk');

const shardManager = new ShardingManager('./bot.js', {
	token: process.env.BOT_TOKEN,
});

shardManager.on('shardCreate', (shard) => {
	console.log(
		`${chalk.greenBright('[SHARD MANAGER]')} A shard ${
			shard.id
		} foi iniciada corretamente`,
	);
});

shardManager.spawn();
