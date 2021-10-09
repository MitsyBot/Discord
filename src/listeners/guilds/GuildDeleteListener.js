const Listener = require('../../structures/events/Listener')
const { EmbedBuilder, TopGGUtils, BlacklistUtils } = require('../../utils')

module.exports = class GuildDeleteListener extends Listener {
  constructor() {
    super()
    this.event = 'guildDelete'
  }

  async on(client, guild) {
    const top_gg = new TopGGUtils()
    await top_gg.post(client)
    const blacklist = new BlacklistUtils(client)
    if (!process.env.JOIN_AND_LEAVE_GUILD_CHANNEL_LOG) return
    client.getRESTChannel(process.env.JOIN_AND_LEAVE_GUILD_CHANNEL_LOG).then(async (channel) => {
      if (!channel) return
      const webhooks = await channel.getWebhooks()
      let webhook = webhooks.filter((w) => w.name === 'Mitsy Guilds' && w.user.id === client.user.id)[0]
      if (!webhook) {
        webhook = await channel.createWebhook({
          name: 'Mitsy Guilds',
          options: {
            type: 1
          }
        })
      }

      const owner = await client.getRESTUser(guild.ownerID)
      if (await blacklist.verifyGuild(guild)) {
        const embed = new EmbedBuilder()
        embed.setColor('#730101')
        embed.setTitle('Servidor em Blacklist')
        embed.setDescription(`Eu sai do servidor pois ela esta no meu blacklistt\n**Nome:** ${guild.name} (\`${guild.id}\`)\n**Dono:** ${owner.username}#${owner.discriminator}`)
        embed.setFooter(`Instancia: ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL)

        client.executeWebhook(webhook.id, webhook.token, {
          embeds: [embed],
          avatarURL: 'https://i.imgur.com/E8WVXbh.png',
          username: 'Mitsy Guilds'
        })
        return
      }

      const embed = new EmbedBuilder()
      embed.setColor('#eb2323')
      embed.setTitle('Servidor deletado')
      embed.setDescription(`**Nome:** ${guild.name} (\`${guild.id}\`)\n**Dono:** ${owner.username}#${owner.discriminator}`)
      embed.setFooter(`Instancia: ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL)

      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://i.imgur.com/E8WVXbh.png',
        username: 'Mitsy Guilds'
      })

      client.database.guilds.getAndDelete(guild.id)
    })
  }
}
