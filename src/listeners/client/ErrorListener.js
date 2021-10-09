const Listener = require('../../structures/events/Listener')
const { EmbedBuilder, Logger } = require('../../utils')

module.exports = class ErrorListener extends Listener {
  constructor() {
    super()
    this.event = 'error'
  }

  async on(client, error, shard) {
    const _locale = client.i18nRegistry.getT('pt-BR')
    if (!process.env.ERROR_CHANNEL_LOG) return
    client.getRESTChannel(process.env.ERROR_CHANNEL_LOG).then(async (channel) => {
      if (!channel) return
      const webhooks = await channel.getWebhooks()
      let webhook = webhooks.filter((w) => w.name === 'Mitsy Errors' && w.user.id === client.user.id)[0]
      if (!webhook) {
        webhook = await channel.createWebhook({
          name: 'Mitsy Errors',
          options: {
            type: 1
          }
        })
      }

      const embed = new EmbedBuilder()
      embed.setColor('ERROR')
      embed.setTitle(_locale('events:executionFailure.embedTitle'))
      embed.setDescription(`\`\`\`js\n${error.stack.slice(0, 1800)}\`\`\``)
      embed.setFooter(`Instancia: ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL)
      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://i.imgur.com/zxj5oQ7.png',
        username: 'Mitsy Errors'
      })
    })

    Logger.error(error)
  }
}
