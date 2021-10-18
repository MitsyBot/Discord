const { Command, EmbedBuilder } = require('../../../utils')

module.exports = class BotSuggestionCommand extends Command {
  constructor() {
    super({
      name: 'suggestion',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }]
    })
  }

  async run(ctx) {
    const sugestion = ctx.args.join(' ')
    ctx.send(sugestion)
}
}
