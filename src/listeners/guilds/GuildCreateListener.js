const Listener = require('../../structures/events/Listener')
const { EmbedBuilder, TopGGUtils, BlacklistUtils } = require('../../utils')

module.exports = class GuildCreateListener extends Listener {
  constructor() {
    super()
    this.event = 'guildCreate'
  }

  async on(client, guild) {
    client.database.guilds.getOrCreate(guild.id, {
      lang: guild.preferredLocale
    })

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
        embed.setTitle('Servidor em blacklist')
        embed.setDescription(`Alguem tentou me adicionar no servidor porem eu estou na lista de blacklists\n**Nome:** ${guild.name} (\`${guild.id}\`)\n**Dono:** ${owner.username}#${owner.discriminator}`)
        embed.setFooter(`Instancia: ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL)

        client.executeWebhook(webhook.id, webhook.token, {
          embeds: [embed],
          avatarURL: 'https://i.imgur.com/E8WVXbh.png',
          username: 'Mitsy Guilds'
        })

        guild.leave()
        return
      }

      const embed = new EmbedBuilder()
      embed.setColor('#187000')
      embed.setTitle('Entrei no servidor')
      embed.setDescription(`**Nome:** ${guild.name} (\`${guild.id}\`)\n**Dono:** ${owner.username}#${owner.discriminator}`)
      embed.setFooter(`Instancia: ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL)

      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://i.imgur.com/E8WVXbh.png',
        username: 'Mitsy Guilds'
      })
    })
  }
}
