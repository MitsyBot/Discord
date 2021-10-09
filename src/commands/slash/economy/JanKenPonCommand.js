const { Command } = require('../../../utils')
const { CommandBase, CommandOptions, Choice } = require('eris')

module.exports = class JanKenPonCommand extends Command {
  constructor() {
    super({
      name: 'jankenpon',
      aliases: ['ppt', 'pedrapapeltesoura', 'rps', 'janken'],
      arguments: 1,
      hasUsage: true,
      slash: new CommandBase()
        .setName('jankenpon')
        .setDescription('Jogue pedra papel ou tesoura apostando.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('choice')
            .setDescription('Escolha uma dessas opçõs.')
            .addChoices(
              new Choice()
                .setName('pedra')
                .setValue('pedra'),
              new Choice()
                .setName('papel')
                .setValue('papel'),
              new Choice()
                .setName('tesoura')
                .setValue('tesoura'),
            )
        )
    })
  }

  async run(ctx) {
    const user = await ctx.db.user
    const client = await ctx.client.database.users.getOrCreate(ctx.client.user.id)
    const options = ['pedra', 'papel', 'tesoura']
    if (!['pedra', 'papel', 'tesoura', 'rock', 'paper', 'scissors'].includes(ctx.args[0])) return ctx.replyT('error', 'commands:jankenpon.optionNotFound')
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
      tesoura: ['pedra', 'rock'],
      papel: ['tesoura', 'scissors'],
      pedra: ['papel', 'paper']
    }

    const clientDrawMappings = {
      tesoura: 'scissors',
      pedra: 'rock',
      papel: 'paper',
      scissors: 'scissors',
      rock: 'rock',
      paper: 'paper'
    }

    const userWinOption = (clientChoiceMappings[clientChoice]).includes(clientDrawMappings[me])
    if (userWinOption) {
      emoji = 'mitsy_upset'
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

    ctx.send('Pedra papel tesoura...').then(msg => {
      setTimeout(() => {
        msg.delete()
        ctx.reply(emoji, result)
      }, 2000)
    })
  }
}
