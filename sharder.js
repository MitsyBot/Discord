const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./index.js', {
	token: process.env.BOT_TOKEN,
	totalShards: parseInt(process.env.SHARD_COUNT) || 'auto',
});

manager.spawn();
manager.on('shardCreate', shard => console.log(`Iniciando a shard ${shard.id}`));
