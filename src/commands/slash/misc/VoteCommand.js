const { Command, EmbedBuilder } = require('../../../utils')
const { CommandBase, CommandOptions, Choice } = require('eris')

module.exports = class VoteCommand extends Command {
  constructor() {
    super({
      name: 'vote',
      aliases: ['votar'],
      arguments: 0,
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('vote')
        .setDescription('Mostrar como pode votar em mim.')

    })
  }

  async run(ctx) {
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setTitle(ctx._locale('commands:vote.title'))
    embed.setDescription(ctx._locale('commands:vote.embedVoted'))
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send(embed.build())
  }
}
