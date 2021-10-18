const { EmbedBuilder } = require('../../utils')

module.exports = class WatchDog {

    static shardError (cluster, shard, client) {
        client.getRESTChannel(process.env.WATCHDOGGO_CHANNEL).then(async (channel) => {
            if (!channel) return
            
            const webhooks = await channel.getWebhooks()
            
            let webhook = webhooks.filter((w) => w.name === 'WatchDog' && w.user.id === client.user.id)[0]
            if (!webhook) {
              webhook = await channel.createWebhook({
                name: 'WatchDog',
                options: {
                  type: 1
                }
              })
            }
      
            const embed = new EmbedBuilder()
                  embed.setColor('ERROR')
                  embed.setTitle(`A shard ${shard} esta offline no cluster [${cluster}] `)
                  embed.setDescription(`A shard ${shard} foi desligada inesperadamente, aguarde enquanto investigamos o problema`)
      
            client.executeWebhook(webhook.id, webhook.token, {
              embeds: [embed],
              avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
              username: 'WatchDog'
            })
          })
      }

      static shardConnection (cluster, shard, type, client, color) {
        client.getRESTChannel(process.env.WATCHDOGGO_CHANNEL).then(async (channel) => {
            if (!channel) return
            
            const webhooks = await channel.getWebhooks()
            
            let webhook = webhooks.filter((w) => w.name === 'WatchDog' && w.user.id === client.user.id)[0]
            if (!webhook) {
              webhook = await channel.createWebhook({
                name: 'WatchDog',
                options: {
                  type: 1
                }
              })
            }
      
            const embed = new EmbedBuilder()
                  embed.setColor(color)
                  embed.setTitle(`A shard ${shard} ${type} no cluster [${cluster}] `)
                  embed.setDescription(`A shard ${shard} ${type}, Yay!`)
      
            client.executeWebhook(webhook.id, webhook.token, {
              embeds: [embed],
              avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
              username: 'WatchDog'
            })
          })
      }
}