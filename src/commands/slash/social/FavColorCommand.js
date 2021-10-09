const { Command } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class FavColorCommand extends Command {
  constructor() {
    super({
      name: 'favcolor',
      aliases: ['favoritecolor', 'corfavorita'],
      arguments: 1,
      hasUsage: true,
      slash: new CommandBase()
        .setName('favcolor')
        .setDescription('Muda a cor do seu perfil.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('color')
            .setDescription('por exemplo: #f55f96')
            .isRequired(),
        )
    })
  }

  async run(ctx) {
    if (ctx.db.user.comets < 150) return ctx.replyT('error', 'commands:favcolor.poorUser', { 0: ctx.db.user.comets - 75 })
    const color = ctx.args.arguments('color').value
    if (!color.startsWith('#')) return ctx.replyT('error', 'commands:favcolor.invalidColor')

    ctx.db.user.profileColor = color
    ctx.db.user.comets -= 150
    ctx.db.user.save().then(() => {
      ctx.replyT('success', 'commands:favcolor.successfullyChanged')
    })
  }
}
