const { Command, EmbedBuilder } = require('../../../utils')

module.exports = class InviteCommand extends Command {
  constructor() {
    super({
      name: 'invite',
      aliases: ['convite', 'convidar'],
      arguments: 0,
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }]
    })
  }

  async run(ctx) {
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setTitle(ctx._locale('commands:invite.addMeInYourGuild'))
    embed.setDescription(ctx._locale('commands:invite.canAddMe', { 0: ctx.client.user.id }))
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send(embed.build())
  }
}
