const { EmbedBuilder } = require('../../utils')

module.exports = class StarTracker {

    static singleuserDetected (ctx, type, amount, user) {
        ctx.client.getRESTChannel(process.env.STARTRACKER_CHANNEL).then(async (channel) => {
            if (!channel) return
            
            const webhooks = await channel.getWebhooks()
            
            let webhook = webhooks.filter((w) => w.name === 'StarTracker' && w.user.id === ctx.client.user.id)[0]
            if (!webhook) {
              webhook = await channel.createWebhook({
                name: 'StarTracker',
                options: {
                  type: 1
                }
              })
            }
      
            const embed = new EmbedBuilder()
                  embed.setColor('TRANSACTION')
                  embed.setTitle(`${amount} usando ${type}`)
                  embed.setDescription(`💵 Quem recebeu\n<@${user.id}>\n\`\`\`${user.username}#${user.discriminator}\`\`\``)
                  embed.setFooter(`${user.username} recebeu ${amount} usando ${type}`)
      
            ctx.client.executeWebhook(webhook.id, webhook.token, {
              embeds: [embed],
              avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
              username: 'StarTracker'
            })
          })
      }


      static multipleuserDetected (ctx, type, amount, fromUser, toUser) {
        ctx.client.getRESTChannel(process.env.STARTRACKER_CHANNEL).then(async (channel) => {
            if (!channel) return
            
            const webhooks = await channel.getWebhooks()
            
            let webhook = webhooks.filter((w) => w.name === 'StarTracker' && w.user.id === ctx.client.user.id)[0]
            if (!webhook) {
              webhook = await channel.createWebhook({
                name: 'StarTracker',
                options: {
                  type: 1
                }
              })
            }
            const embed = new EmbedBuilder()
                  embed.setColor('TRANSACTION')
                  embed.setTitle(`${amount} usando ${type}`)
                  embed.addField('💵 Quem Pagou', `<@${fromUser.id}>\n\`\`\`${fromUser.username}#${fromUser.discriminator}\`\`\``)
                  embed.addField('💵 Quem Recebeu', `<@${toUser.id}>\n\`\`\`${toUser.username}#${toUser.discriminator}\`\`\``)
                  embed.setFooter(`${toUser.username} recebeu ${amount} usando ${type}`)
      
            ctx.client.executeWebhook(webhook.id, webhook.token, {
              embeds: [embed],
              avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
              username: 'StarTracker'
            })
          })
      }
}