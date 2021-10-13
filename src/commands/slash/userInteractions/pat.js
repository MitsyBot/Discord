const { Command, EmbedBuilder, Emoji } = require('../../../utils')
const axios = require('axios')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class RepCommand extends Command {
  constructor() {
    super({
      name: 'pat',
      aliases: ['headpat', 'head-pat', 'cafune'],
      arguments: 1,
      hasUsage: true,
      slash: new CommandBase()
        .setName('pat')
        .setDescription('Faça cafuné em algum usuário.')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mencione o usuário.')
            .isRequired(),
        )
    })
  }

  async run(ctx) {
    const user = ctx.args.get('user')?.value
    const member = await ctx.getUser(user?.id ?? user)
        if (!member) return ctx.replyT('error', 'basic:invalidUser')
    
    const embedTitle = ctx._locale('commands:pat.patTitle', { user: ctx.message.author.username, member: member.username })

    axios({
        url: 'https://mitsy.website/api/v2/userinteraction/pat',
        method: 'GET',
    }).then(response => {
        const url = response.data.url

        const embed = new EmbedBuilder()
        embed.setTitle(embedTitle)
        embed.setColor('DEFAULT')
        embed.setImage(url, 1024, 1024)
        embed.setFooter(`©️ ${ctx.client.user.username}`)
        embed.setTimestamp()

        ctx.send(embed.build())
    })
  }
}