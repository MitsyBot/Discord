const { Command } = require('../../../utils')
const { CommandBase } = require('eris')

module.exports = class EmojiCommand extends Command {
  constructor() {
    super({
      name: 'criarparty',
      aliases: [],
      hasUsage: true,
      arguments: 1,
      permissions: [{
        entity: 'bot',
        permissions: ['attachFiles']
      }],
      slash: new CommandBase()
        .setName('criarparty')
        .setDescription('Crie uma party de y2g.')
    })
  }

  async run(ctx) {
ctx.reply('Ocorreu um erro ao criar o invite')
  }
}
