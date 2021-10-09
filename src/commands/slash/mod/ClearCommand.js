const { Command, Emoji } = require('../../../utils')
const { CommandBase, CommandOptions, Choice } = require('eris')

module.exports = class ClearCommand extends Command {
  constructor() {
    super({
      name: 'clear',
      aliases: ['limpar'],
      arguments: 1,
      hasUsage: true,
      permissions: [{
        entity: 'both',
        permissions: ['manageMessages', 'readMessageHistory', 'viewChannel']
      }],
      slash: new CommandBase()
        .setName('clear')
        .setDescription('Limpar as mensagens de um canal')
        .addOptions(
          new CommandOptions()
            .setType(4)
            .setName('quantity')
            .setDescription('Quantidade de mensagens para apagar.')
            .isRequired(),
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mencione o membro no servidor')
        )
    })
  }

  async run(ctx) {
    const quantity = ctx.args.get('quantity').value
    if (quantity > 100) return ctx.replyT('error', 'commands:clear.limit')
    if (isNaN(quantity)) return ctx.replyT('error', 'commands:clear.nan')
    const user = await ctx.getUser(ctx.args.get('user')?.value?.id ?? ctx.args.get('user')?.value)
    const filter = user ? ((msg) => msg.author.id === user?.id) : null
    ctx.message.channel.purge(Number(quantity), filter).then((msg) => {
      ctx.message.channel.createMessage(`${Emoji.getEmoji('success').mention} **|** ${ctx.message.author.mention}, ${ctx._locale('commands:clear.success', { messages: msg })}`).then((msg) => setTimeout(() => msg.delete(), 5000))
    })
  }
}
