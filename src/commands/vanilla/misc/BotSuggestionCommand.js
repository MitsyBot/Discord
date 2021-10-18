const { Command, EmbedBuilder } = require('../../../utils')

module.exports = class BotSuggestionCommand extends Command {
  constructor() {
    super({
      name: 'suggestion',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }]
    })
  }

  async run(ctx) {
    const sugestion = ctx.args.join(' ')
    ctx.client.getRESTChannel(process.env.SUGGESTION_CHANNEL).then(async (channel) => {
        if (!channel) return
        
        const webhooks = await channel.getWebhooks()
        
        let webhook = webhooks.filter((w) => w.name === 'Suggestion' && w.user.id === ctx.client.user.id)[0]
        if (!webhook) {
          webhook = await channel.createWebhook({
            name: 'Suggestion',
            options: {
              type: 1
            }
          })
        }
        const embed = new EmbedBuilder()
              embed.setColor('SUGGESTION')
              embed.setTitle(`${ctx.message.author.username}#${ctx.message.author.discriminator} Fez uma sugestão`)
              embed.setDescription(sugestion)
              embed.setFooter(`Sua sugestão ira ser analisada`)
  
        ctx.client.executeWebhook(webhook.id, webhook.token, {
          embeds: [embed],
          avatarURL: ctx.message.author.avatarURL,
          username: ctx.message.author.username
        })
      })
}
}
