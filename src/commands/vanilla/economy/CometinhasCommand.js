const { Command } = require('../../../utils')

module.exports = class cometsCommand extends Command {
  constructor() {
    super({
      name: 'cometinhas',
      aliases: ['atm']
    })
  }

  async run(ctx) {
    const member = await ctx.getUser(ctx.args[0])
    if (!member) {
      const comets = Number(ctx.db.user.comets).toLocaleString()
      await ctx.replyT('comet', 'commands:comets.comets', { comets: `\`${comets}\`` })
      return
    }

    const userData = await ctx.db.db.getOrCreate(member.id)
    const comets = Number(userData.comets).toLocaleString()
    return ctx.replyT('comet', 'commands:comets.onMention', { user: member.mention, comets: `\`${comets}\`` })
  }
}
