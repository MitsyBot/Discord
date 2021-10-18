const { Command, EmbedBuilder } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class PatCommand extends Command {
  constructor() {
    super({
      name: 'pat',
      aliases: ['cafune', 'cafuné'],
      arguments: 1,
      hasUsage: true,
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('pat')
        .setDescription('Faça cafuné em seu amigo.')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('usuario')
            .setDescription('Mencione o usuario')
            .isRequired()
        )
    })
  }

  async run(ctx) {
    const member = await ctx.getUser(ctx.args.get('usuario').value?.id ?? ctx.args.get('usuario').value)
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    
    axios({
      url: 'https://mitsy.website/api/v2/userinteraction/kiss',
      method: 'GET',
  }).then(response => {
      const url = response.data.url
    const embed = new EmbedBuilder()
    embed.setColor('ACTION')
    embed.setDescription(ctx._locale('commands:userInteraction.kissTitle', { 0: ctx.message.member.mention, 1: member.mention }))
    embed.setImage(url, 1024, 1024)
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send(embed.build())
    })
  }
}