const Listener = require('../../structures/events/Listener')
const Watchdog = require('../../structures/util/WatchDog')
const { EmbedBuilder, Logger } = require('../../utils')

module.exports = class ShardPreReadyListener extends Listener {
  constructor() {
    super()
    this.event = 'shardPreReady'
  }

  async on(client, shardID) {
    if (!process.env.SHARD_CHANNEL_LOG) return
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
            embed.setColor('RESTARTING')
            embed.setTitle('Shard Reconectando')
            embed.setDescription(`Cluster: #${process.env.CLUSTER_ID} = Shard: ${shardID} => \`Reconectando\``)
            embed.setFooter(`Instancia: ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL)

      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
        username: 'Mitsy Sharder'
      })
    })
    Watchdog.shardError(process.env.CLUSTER_ID, shardID, 'esta reconectando', 'RESTARTING')
    Logger.shardMessage(`Yay! conectando a shard ${shardID}...`)
  }
}
