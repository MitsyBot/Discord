const { Command } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class cometsCommand extends Command {
  constructor() {
    super({
      name: 'comets',
      aliases: ['comet'],
      slash: new CommandBase()
        .setName('comets')
        .setDescription('Mostra os cometinhas de alguem/seus.')
        .addOptions(new CommandOptions()
          .setType(6)
          .setName('user')
          .setDescription('Mencione um usuario.')
        )
    })
  }

  async run(ctx) {
    const user = ctx.args.get('user')?.value
    const member = await ctx.getUser(user?.id ?? user)
    if (!member) {
      const comets = Number(ctx.db.user.comets).toLocaleString()
      await ctx.replyT('comet', 'commands:comets.comets', { comets: `\`${comets}\``})
      return
    }

    const userData = await ctx.db.db.getOrCreate(member.id)
    const comets = Number(userData.comets).toLocaleString()
    return ctx.replyT('comet', 'commands:comets.onMention', { user: member.mention, comets: `\`${comets}\`` })
  }
}
