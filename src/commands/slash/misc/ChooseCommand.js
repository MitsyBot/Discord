const { Command } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class ChooseCommand extends Command {
  constructor() {
    super({
      name: 'choose',
      aliases: ['escolher'],
      arguments: 1,
      hasUsage: true,
      slash: new CommandBase()
        .setName('choose')
        .setDescription('Faça com que o bot escolha algo')
        .addOptions(
          new CommandOptions()
            .setName('choose')
            .setDescription('Use `,` para separar')
            .setType(3)
            .isRequired()
        )
    })
  }

  async run(ctx) {
    const argArray = ctx.args.get('choose').value.split(',')
    const chosen = argArray[Math.floor(Math.random() * argArray.length)].trim()

    return ctx.replyT('mitsy_think', 'commands:choose.chosen', { chosen: chosen })
  }
}
