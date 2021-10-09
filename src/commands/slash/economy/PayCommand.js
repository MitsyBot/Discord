const { Command, Button, ResponseAck, Emoji } = require('../../../utils')
const { CommandBase, CommandOptions, Choice } = require('eris')

module.exports = class PayCommand extends Command {
  constructor() {
    super({
      name: 'pay',
      aliases: ['pagar', 'doar'],
      arguments: 2,
      hasUsage: true,
      permissions: [{
        entity: 'bot',
        permissions: ['addReactions']
      }],
      slash: new CommandBase()
        .setName('pay')
        .setDescription('Envie cometinhas a um usuario')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mencione o membro no servidor')
            .isRequired(),
          new CommandOptions()
            .setType(4)
            .setName('amount')
            .setDescription('Quantidade de cometinhas para transferir.')
            .isRequired(),
        )
    })
  }

  async run(ctx) {
    const member = await ctx.getUser(ctx.args.get('user').value?.id ?? ctx.args.get('user').value)
    if (!member) return ctx.replyT('error', 'basic:invalidUser')

    const fromUser = ctx.db.user
    const value = ctx.args.get('amount').value
    const toUser = await ctx.db.db.getOrCreate(member.id)

    if (ctx.message.member.id === member.id) return ctx.replyT('error', 'commands:pay.userMismatch')
    if (!value) return ctx.replyT('error', 'commands:pay.valueMismatch')
    if (isNaN(Number(value))) return ctx.replyT('error', 'commands:pay.valueMismatch')
    if (Number(value) === Infinity) return ctx.replyT('error', 'commands:pay.valueMismatch')
    if (value <= 0) return ctx.replyT('error', 'commands:pay.valueMismatch')
    if (value > fromUser.comets) return ctx.replyT('error', 'commands:pay.poorUser')
    const totalcomets = Math.round(value)

    ctx.interaction()
      .components(new Button()
        .setLabel(ctx._locale('basic:boolean.true'))
        .customID('confirm_button')
        .setStyle(3),
        new Button()
          .setLabel(ctx._locale('basic:boolean.false'))
          .customID('reject_button')
          .setStyle(4))
      .returnCtx()
      .replyT('warn', 'commands:pay.confirm', { user: member.mention, comets: totalcomets, total: value })
      .then(message => {
        const ack = new ResponseAck(message)
        ack.on('collect', (data) => {
          if(data.interaction.buttonEvent.member.id !== message.author.id) return;

          switch (data.interaction.buttonEvent.customID) {
            case 'confirm_button': {
              fromUser.comets -= totalcomets
              toUser.comets += totalcomets
              ctx.db.user.save()
              toUser.save().then(() => {
                ack.sendAck('update', {
                  content: `${Emoji.getEmoji('comet').mention} **|** ${message.author.mention}, ${ctx._locale('commands:pay.success', { comets: totalcomets, user: member.mention })}`,
                  components: [
                    {
                      type: 1,
                      components: [
                        new Button()
                          .setLabel(ctx._locale('basic:boolean.true'))
                          .customID('confirm_button')
                          .setStyle(3)
                          .setStatus(true)
                          .data(),
                        new Button()
                          .setLabel(ctx._locale('basic:boolean.false'))
                          .customID('reject_button')
                          .setStyle(4)
                          .setStatus(true)
                          .data()
                      ]
                    }
                  ]
                })
              })
            }
              break
            case 'reject_button': {
              ack.sendAck('update', {
                content: `${Emoji.getEmoji('error').mention} **|** ${message.author.mention}, ${ctx._locale('commands:pay.cancelled')}`,
                components: [
                  {
                    type: 1,
                    components: [
                      new Button()
                        .setLabel(ctx._locale('basic:boolean.true'))
                        .customID('confirm_button')
                        .setStyle(3)
                        .setStatus(true)
                        .data(),
                      new Button()
                        .setLabel(ctx._locale('basic:boolean.false'))
                        .customID('reject_button')
                        .setStyle(4)
                        .setStatus(true)
                        .data()
                    ]
                  }
                ]
              })
            }
              break
          }
        })
      })
  }
}
