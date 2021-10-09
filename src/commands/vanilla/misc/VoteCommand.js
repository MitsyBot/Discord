const { Command, EmbedBuilder } = require('../../../utils')

module.exports = class VoteCommand extends Command {
  constructor() {
    super({
      name: 'vote',
      aliases: ['votar'],
      arguments: 0,
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }]
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
