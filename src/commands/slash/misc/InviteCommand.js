const { Command, EmbedBuilder } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class InviteCommand extends Command {
  constructor() {
    super({
      name: 'invite',
      aliases: ['convite', 'convidar'],
      arguments: 0,
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('invite')
        .setDescription('Como você pode me adicionar no servidor? descubra.')
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
