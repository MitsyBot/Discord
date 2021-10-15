const { Command, Button, ResponseAck, Emoji } = require('../../../utils')
const StarTracker = require('../../../structures/util/StarTracker')

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
      }]
    })
  }

  async run(ctx) {
    const member = await ctx.getUser(ctx.args[0])
    if (!member) return ctx.replyT('error', 'basic:invalidUser')

    if (member.id === ctx.client.user.id) return ctx.replyT('mitsy_what', 'commands:pay.cannotPayToMe')
    if (member.bot) return ctx.replyT('mitsy_what', 'commands:pay.cannotPayToBot')
    if (ctx.message.author.id === member.id) return ctx.replyT('error', 'commands:pay.userMismatch')
    
    const user1 = ctx.message.author
    const fromUser = ctx.db.user
    const value = ctx.args[1]
    const toUser = await ctx.db.db.getOrCreate(member.id)

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
          if(data.interaction.buttonEvent.member.id !== fromUser.id) return;

          switch (data.interaction.buttonEvent.customID) {
            case 'confirm_button': {
              fromUser.comets -= totalcomets
              toUser.comets += totalcomets
              ctx.db.user.save()
              StarTracker.multipleuserDetected(ctx, 'Pay', totalcomets, user1, member)
              toUser.save().then(() => {
                ack.sendAck('update', {
                  content: `${Emoji.getEmoji('comet').mention} **|** <@${fromUser.id}>, ${ctx._locale('commands:pay.success', { comets: totalcomets, user: member.mention })}`,
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
                content: `${Emoji.getEmoji('error').mention} **|** <@${fromUser.id}>, ${ctx._locale('commands:pay.cancelled')}`,
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
