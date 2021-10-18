const Listener = require('../../structures/events/Listener')
const Watchdog = require('../../structures/util/WatchDog')
const { EmbedBuilder, Logger } = require('../../utils')

module.exports = class ShardDisconnectListener extends Listener {
  constructor() {
    super()
    this.event = 'shardDisconnect'
  }

  async on(client, error, shardID) {
    client.shardUptime.set(shardID, {
      shardID,
      uptime: NaN
    })
    
    if(!process.env.SHARD_CHANNEL_LOG) return;
    if(error.message.includes('Connection reset by peer')) return; // Safe to ignore error de acordo com as docs do Eris.

    client.getRESTChannel(process.env.SHARD_CHANNEL_LOG).then(async (channel) => {
      if (!channel) return
      
      const webhooks = await channel.getWebhooks()
      
      let webhook = webhooks.filter((w) => w.name === 'Mitsy Sharder' && w.user.id === client.user.id)[0]
      if (!webhook) {
        webhook = await channel.createWebhook({
          name: 'Mitsy Sharder',
          options: {
            type: 1
          }
        })
      }

      const embed = new EmbedBuilder()
            embed.setColor('ERROR')
            embed.setTitle('Shard desconectada')
            embed.setDescription(`Cluster: #${process.env.CLUSTER_ID} = Shard: ${shardID} => \`Desconectada\``)
            embed.addField('Talvez o erro seja', error.message)
            embed.setFooter(`Instancia: ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL)

      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
        username: 'Mitsy Sharder'
      })
    })
    
    const watchdoggoembed = new EmbedBuilder()
    watchdoggoembed.setColor('ERROR')
    watchdoggoembed.setTitle(`A shard ${shardID} se desconectou no cluster [${process.env.CLUSTER_ID}] `)
    watchdoggoembed.setDescription(`A shard ${shardID} foi desconectada, aguarde enquanto investigamos o motivo!`)


    client.executeWebhook(process.env.WATCHDOGGO_ID, process.env.WATCHDOGGO_TOKEN, {
      embeds: [watchdoggoembed],
      avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
      username: 'WatchDog'
    })

    Logger.shardMessage(`Whoops, a shard ${shardID} foi desconectada forçadamente!`)
  }
}