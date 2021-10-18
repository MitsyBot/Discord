const { Command, EmbedBuilder } = require('../../../utils')
const { CommandBase, CommandOptions, Choice } = require('eris')

module.exports = class BugReportCommand extends Command {
  constructor() {
    super({
      name: 'suggestion',
      aliases: ['sugerir'],
      arguments: 1,
      hasUsage: true,
      slash: new CommandBase()
        .setName('suggestion')
        .setDescription('Sugira algo para a mitsy')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('sugestão')
            .setDescription('A sua sugestão'),
        )
    })
  }

  async run(ctx) {
          // Slash disabled command
    return ctx.replyT('mitsy_what', 'commands:disabled.slashDisabled', {0: `${ctx.db.guild.prefix}profile`})

    const bug = ctx.args.get('sugestão')
    ctx.client.getRESTChannel(process.env.SUGGESTION_CHANNEL).then(async (channel) => {
        if (!channel) return
        
        const webhooks = await channel.getWebhooks()
        
        let webhook = webhooks.filter((w) => w.name === 'Sugestões' && w.user.id === ctx.client.user.id)[0]
        if (!webhook) {
          webhook = await channel.createWebhook({
            name: 'Sugestões',
            options: {
              type: 1
            }
          })
        }
        const embed = new EmbedBuilder()
              embed.setColor('SUGESTION')
              embed.setTitle(`${ctx.message.author.username}#${ctx.message.author.discriminator} Sugeriu algo`)
              embed.setDescription(bug)
              embed.setFooter(`=`)
  
        ctx.client.executeWebhook(webhook.id, webhook.token, {
          embeds: [embed],
          avatarURL: ctx.message.author.avatarURL,
          username: ctx.message.author.username
        })
      })
      ctx.replyT('success', 'commands:sugestion.send')
  }
}
