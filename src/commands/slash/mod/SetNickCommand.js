const { Command } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class SetNickCommand extends Command {
  constructor() {
    super({
      name: 'setnick',
      aliases: ['changenick', 'updatenick', 'alterarnickname', 'setnickname'],
      arguments: 1,
      permissions: [{
        entity: 'both',
        permissions: ['manageNicknames']
      }],
      slash: new CommandBase()
        .setName('setnick')
        .setDescription('Defina o nome de um membro')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mencione o membro.')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('nickname')
            .setDescription('Novo nickname.')
            .isRequired(),
        )
    })
  }

  async run(ctx) {
    const member = await ctx.getMember(ctx.args.get('user').value?.id ?? ctx.args.get('user').value)
    const newNick = ctx.args.get('nickname').value
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    try {
      await member.edit({
        nick: newNick
      })
      return ctx.replyT('success', 'commands:setnick.success', { member: member.username, nickname: newNick })
    } catch {
      return ctx.replyT('error', 'commands:setnick.error')
    }
  }
}
