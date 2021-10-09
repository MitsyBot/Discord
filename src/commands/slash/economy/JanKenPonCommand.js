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
        .setDescription('Jogue pedra papel tesoura.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('choice')
            .setDescription('Escolha uma das opções.')
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
            .isRequired(),
          new CommandOptions()
            .setType(10)
            .setName('value')
            .setDescription('Cometinhas para apostar.')
            .isRequired()
        )
    })
  }

  async run(ctx) {
    const user = await ctx.db.user
    const client = await ctx.client.database.users.getOrCreate(ctx.client.user.id)
    const options = ['pedra', 'papel', 'tesoura']
    if (!['pedra', 'papel', 'tesoura'].includes(ctx.args.get('choice').value.toLowerCase())) return ctx.replyT('error', 'commands:jankenpon.optionNotFound')
    const clientChoice = options[Math.floor(Math.random() * options.length)]
    const me = ctx.args.get('choice').value.toLowerCase()
    let result
    let emoji
    const value = ctx.args.get('value').value
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
      emoji = 'mitsy_rage'
      result = ctx._locale('commands:jankenpon.youWin', { 0: ctx._locale(`commands:jankenpon.choice.${clientDrawMappings[me]}`), 1: ctx._locale(`commands:jankenpon.choice.${clientDrawMappings[clientChoice]}`), 2: Number(value).toLocaleString() })
      user.comets += Math.floor(value)
      user.save()
      if (Number(value) <= client.comets) {
        client.comets -= Math.floor(value)
        client.save()
      }
    } else if (clientDrawMappings[clientChoice] === clientDrawMappings[me]) {
      emoji = 'mitsy_what'
      result = ctx._locale('commands:jankenpon.tie')
    } else if (!userWinOption) {
      emoji = 'mitsy_whoa'
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