const { Command, EmbedBuilder, TopGGUtils } = require('../../../utils')
const moment = require('moment')
const StarTracker = require('../../../structures/util/StarTracker')

module.exports = class DailyCommand extends Command {
  constructor() {
    super({
      name: 'daily',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }]
    })
  }

  async run(ctx) {
    const top_gg = new TopGGUtils()
    const user = ctx.db.user
    if (parseInt(user.timeDaily) > Date.now()) {
      return ctx.replyT('error', 'commands:daily.hasBeenPicked', {
        0: parseInt(user.timeDaily - Date.now()) > 3600000 ? moment.utc(user.timeDaily - Date.now()).format('hh:mm:ss') : moment.utc(user.timeDaily - Date.now()).format('mm:ss')
      })
    }

    const hasVoted = await top_gg.getVote(ctx.message.author.id)

    if (!hasVoted) {
      const embed = new EmbedBuilder()
      embed.setColor('DEFAULT')
      embed.setAuthor(ctx._locale('commands:daily.almostThere'), ctx.message.author.avatarURL)
      embed.setDescription(ctx._locale('commands:daily.explaining'))
      embed.addField(ctx._locale('commands:daily.proceed'), ctx._locale('commands:daily.confirm'))

      return ctx.send(embed.build())
    }

    const amount = Math.floor(Math.random() * (3500 - 300 + 1)) + 300
    const amountSg = Math.floor(Math.random() * (350 - 15 + 1)) + 15
    user.comets += amount
    user.timeDaily = 43200000 + Date.now()
    user.save().then(() => {
      const embed = new EmbedBuilder()
      embed.setColor('DEFAULT')
      embed.setTitle(ctx._locale('commands:daily.cometsDaily'))
      embed.setDescription(ctx._locale('commands:daily.congrats', { 0: Number(amount).toLocaleString(), 1: Number(amountSg).toLocaleString() }))

      ctx.send(embed.build())
    })

    StarTracker.singleuserDetected(ctx, 'Daily', amount, ctx.message.author)
  }
}
