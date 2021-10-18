const Listener = require('../../structures/events/Listener')
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
            embed.setTitle('Shard conectando')
            embed.setDescription(`Cluster: #${process.env.CLUSTER_ID} = Shard: ${shardID} => \`Conectando\``)
            embed.setFooter(`Instancia: ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL)

      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
        username: 'Mitsy Sharder'
      })
    })
    if(process.env.WATCHDOGGO_ID === '' && process.env.WATCHDOGGO_TOKEN === '') {
      return
    } else {
    const watchdoggoembed = new EmbedBuilder()
    watchdoggoembed.setColor('RESTARTING')
    watchdoggoembed.setTitle(`A shard ${shardID} esta se conectando no cluster [${process.env.CLUSTER_ID}] `)
    watchdoggoembed.setDescription(`A shard ${shardID} esta se conectando, aguarde!`)


    client.executeWebhook(process.env.WATCHDOGGO_ID, process.env.WATCHDOGGO_TOKEN, {
      embeds: [watchdoggoembed],
      avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
      username: 'WatchDog'
    })
  }
    Logger.shardMessage(`Yay! conectando a shard ${shardID}...`)
  }
}
