const { Command, EmbedBuilder } = require('../../../utils')
const { CommandBase, CommandOptions, Choice } = require('eris')

module.exports = class BugReportCommand extends Command {
  constructor() {
    super({
      name: 'bugreport',
      aliases: ['reportarbug'],
      arguments: 1,
      hasUsage: true,
      slash: new CommandBase()
        .setName('bugreport')
        .setDescription('Reporte um bug da mitsy')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('bug')
            .setDescription('O bug para reportar.'),
        )
    })
  }

  async run(ctx) {
          // Slash disabled command
    return ctx.replyT('mitsy_what', 'commands:disabled.slashDisabled', {0: `${ctx.db.guild.prefix}profile`})

    const bug = ctx.args.get('bug')
    ctx.client.getRESTChannel(process.env.BUGREPORT_CHANNEL).then(async (channel) => {
        if (!channel) return
        
        const webhooks = await channel.getWebhooks()
        
        let webhook = webhooks.filter((w) => w.name === 'BugReport' && w.user.id === ctx.client.user.id)[0]
        if (!webhook) {
          webhook = await channel.createWebhook({
            name: 'BugReport',
            options: {
              type: 1
            }
          })
        }
        const embed = new EmbedBuilder()
              embed.setColor('BUG')
              embed.setTitle(`${ctx.message.author.username}#${ctx.message.author.discriminator} Reportou um bug`)
              embed.setDescription(bug)
              embed.setFooter(`Iremos corrigir o bug`)
  
        ctx.client.executeWebhook(webhook.id, webhook.token, {
          embeds: [embed],
          avatarURL: ctx.message.author.avatarURL,
          username: ctx.message.author.username
        })
      })
      ctx.replyT('success', 'commands:bugreport.send')
  }
}
