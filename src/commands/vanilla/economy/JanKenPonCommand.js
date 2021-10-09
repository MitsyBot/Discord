const { Command } = require('../../../utils')

module.exports = class JanKenPonCommand extends Command {
  constructor() {
    super({
      name: 'jankenpon',
      aliases: ['ppt', 'pedrapapeltesoura', 'rps', 'janken'],
      arguments: 1,
      hasUsage: true
    })
  }

  async run(ctx) {
    const user = await ctx.db.user
    const client = await ctx.client.database.users.getOrCreate(ctx.client.user.id)
    const options = ['pedra', 'papel', 'tesoura']
    if (!['pedra', 'papel', 'tesoura'].includes(ctx.args[0])) return ctx.replyT('error', 'commands:jankenpon.optionNotFound')
    const clientChoice = options[Math.floor(Math.random() * options.length)]
    const me = ctx.args[0].toLowerCase()
    let result
    let emoji
    const value = ctx.args[1]
    if (!value) return ctx.replyT('warn', 'commands:jankenpon.valueNotInputed')
    const invalidValue = Number(value) < 0 || Number(value) === Infinity || isNaN(value)
    if (invalidValue) return ctx.replyT('error', 'commands:pay.invalidValue')
    if (user.comets < value) return ctx.replyT('error', 'commands:pay.poorUser')
    const clientChoiceMappings = {
      tesoura: ['pedra'],
      papel: ['tesoura'],
      pedra: ['papel']
    }

    const clientDrawMappings = {
      tesoura: 'tesoura',
      pedra: 'pedra',
      papel: 'papel',
    }

    const userWinOption = (clientChoiceMappings[clientChoice]).includes(clientDrawMappings[me])
    if (userWinOption) {
      emoji = 'mitsy_woah'
      result = ctx._locale('commands:jankenpon.youWin', { 0: ctx._locale(`commands:jankenpon.choice.${clientDrawMappings[me]}`), 1: ctx._locale(`commands:jankenpon.choice.${clientDrawMappings[clientChoice]}`), 2: Number(value).toLocaleString() })
      user.comets += Math.floor(value)
      user.save()
      if (Number(value) <= client.comets) {
        client.comets -= Math.floor(value)
        client.save()
      }
    } else if (clientDrawMappings[clientChoice] === clientDrawMappings[me]) {
      emoji = 'mitsy_whoa'
      result = ctx._locale('commands:jankenpon.tie')
    } else if (!userWinOption) {
      emoji = 'mitsy_kek'
      result = ctx._locale('commands:jankenpon.youLose', { 0: ctx._locale(`commands:jankenpon.choice.${clientDrawMappings[me]}`), 1: ctx._locale(`commands:jankenpon.choice.${clientDrawMappings[clientChoice]}`), 2: Number(value).toLocaleString() })
      user.comets -= Math.floor(value)
      client.comets += Math.floor(value)
      user.save()
      client.save()
    }

    ctx.send('Jan ken pon').then(msg => {
      setTimeout(() => {
        msg.delete()
        ctx.reply(emoji, result)
      }, 2000)
    })
  }
}
