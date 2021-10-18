const Listener = require('../../structures/events/Listener')
const { EmbedBuilder, Logger } = require('../../utils')

module.exports = class ShardReadyListener extends Listener {
  constructor() {
    super()
    this.event = 'shardReady'
  }

  async on(client, shardID) {
    if (!process.env.SHARD_CHANNEL_LOG) return
    
    client.shardUptime.set(shardID, {
      shardID,
      uptime: Date.now()
    })

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
            embed.setColor('CONNECTED')
            embed.setTitle('Shard Iniciada')
            embed.setDescription(`Cluster: #${process.env.CLUSTER_ID} = Shard: ${shardID} => \`Iniciada\``)
            embed.setFooter(`Instancia: ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL)

      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
        username: 'Mitsy Sharder'
      })
    })

    const watchdoggoembed = new EmbedBuilder()
    embed.setColor(color)
    embed.setTitle(`A shard ${shardID} está online no cluster [${process.env.CLUSTER_ID}] `)
    embed.setDescription(`A shard ${shardID} esta online, Yay!`)


    client.executeWebhook(process.env.WATCHDOGGO_ID, process.env.WATCHDOGGO_TOKEN, {
      embeds: [watchdoggoembed],
      avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
      username: 'WatchDog'
    })

    Logger.shardMessage(`Ok! A Shard ${shardID} foi conectada!`)
  }
}
