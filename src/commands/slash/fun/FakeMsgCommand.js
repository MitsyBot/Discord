const { Command } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class FakeMsgCommand extends Command {
  constructor() {
    super({
      name: 'fakemsg',
      aliases: [],
      arguments: 2,
      hasUsage: true,
      permissions: [{
        entity: 'bot',
        permissions: ['manageChannels', 'manageWebhooks']
      }],
      slash: new CommandBase()
        .setName('fakemsg')
        .setDescription('Engane alguem com um webhook falso.')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mencione o membro')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('text')
            .setDescription('Bla bla bla texto aleatorio')
            .isRequired(),
        )
    })
  }

  async run(ctx) {
    const member = await ctx.getUser(ctx.args.get('user').value?.id ?? ctx.args.get('user').value)
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    const args = ctx.args.get('text').value
    if (!args) return ctx.replyT('error', 'commands:fakemsg.argsNull')
    let webhook = await ctx.message.channel.getWebhooks()
    webhook = webhook.filter(webhook => webhook.name === 'Mensagem falsa' && webhook.user.id === ctx.client.user.id)[0]
    if (!webhook) {
      webhook = await ctx.message.channel.createWebhook({
        name: 'Mensagem falsa',
        options: {
          type: 1
        }
      })
    }

    ctx.client.executeWebhook(webhook.id, webhook.token, {
      content: args,
      avatarURL: member.avatarURL,
      username: member.username,
      allowedMentions: {
        everyone: false,
        roles: false,
        users: true
      }
    })
    ctx.message.hook.createMessage('owo').then(msg => msg.delete())
  }
}
