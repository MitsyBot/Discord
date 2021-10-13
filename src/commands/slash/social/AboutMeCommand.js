const { Command } = require('../../../utils')
const { CommandOptions, CommandBase } = require('eris')

module.exports = class AboutMeCommand extends Command {
  constructor() {
    super({
      name: 'aboutme',
      aliases: ['bio', 'sobremim'],
      arguments: 1,
      hasUsage: true,
      slash: new CommandBase()
        .setName('aboutme')
        .setDescription('Muda o sobremim do seu perfil.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('text')
            .setDescription('Texto.')
            .isRequired(),
        )
    })
  }

  async run(ctx) {
    const textValue = ctx.args.get('text').value
      if (textValue.length > 128) return ctx.replyT('error', 'commands:aboutme.bioLimit')
    
    const bio = textValue.replace(/[`]/g, '')
          ctx.db.user.aboutme = bio
          ctx.db.user.save()
          
    await ctx.replyT('success', 'commands:aboutme.success', { bio: bio })
  }
}
