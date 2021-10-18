const { Command, EmbedBuilder } = require('../../../utils')

module.exports = class AvatarCommand extends Command {
  constructor() {
    super({
      name: 'avatar',
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
