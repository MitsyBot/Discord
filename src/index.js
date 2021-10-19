const { ShardingManager } = require('discord.js');
const chalk = require('chalk');
const { token } = require('./utils/config.json');

const shardManager = new ShardingManager('./bot.js', {
	token: token,
});

shardManager.on('shardCreate', shard => {
	console.log(`${chalk.greenBright('[SHARD MANAGER]')} A shard de id ${shard.id} foi iniciada corretamente`);
});

shardManager.spawn();