const Listener = require('../../structures/events/Listener')
const { EmbedBuilder, Logger } = require('../../utils')

module.exports = class ShardResumeListener extends Listener {
  constructor() {
    super()
    this.event = 'shardResume'
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
            embed.setColor('RESUMED')
            embed.setTitle('Shard Resumida')
            embed.setDescription(`Cluster: #${process.env.CLUSTER_ID} = Shard: ${shardID} => \`Resumida\``)
            embed.setFooter(`Instancia: ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL)

      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
        username: 'Mitsy Sharder'
      })
    })

    Logger.shardMessage(`LESGO! A shard ${shardID} foi retomada!`)
  }
}
