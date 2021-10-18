const { Command, EmbedBuilder, Button, ResponseAck } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')
const axios = require('axios')

module.exports = class RepCommand extends Command {
  constructor() {
    super({
      name: 'bite',
      aliases: ['morder'],
      arguments: 1,
      hasUsage: true,
      slash: new CommandBase()
        .setName('bite')
        .setDescription('Morda alguém!')
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
    return ctx.replyT('mitsy_what', 'commands:disabled.slashDisabled', {0: `${ctx.db.guild.prefix}bite`})

    const user = ctx.args.get('user')?.value
    const member = await ctx.getUser(user?.id ?? user)
        if (!member) return ctx.replyT('error', 'basic:invalidUser')
    
        const author = ctx.message.author
        let embedTitle = ''
    
        axios({
            url: 'https://mitsy.website/api/v2/userinteraction/bite',
            method: 'GET',
        }).then(response => {
            const url = response.data.url
    
            embedTitle = ctx._locale('commands:userInteraction.biteTitle', { user: author.username, member: member.username })
    
            const embed = new EmbedBuilder()
            embed.setTitle(embedTitle)
            embed.setColor('DEFAULT')
            embed.setImage(url, 1024, 1024)
            embed.setFooter(`©️ ${ctx.client.user.username}`)
            embed.setTimestamp()

            ctx.interaction()
            .components(new Button().setLabel('🔁').customID('back').setStyle(3))
            .returnCtx()
            .sendT(url)
            .then(message => {
                const ack = new ResponseAck(message)
                ack.on('collect', (data) => {
                  axios({
                    url: 'https://mitsy.website/api/v2/userinteraction/bite',
                    method: 'GET',
                  }).then(answerResponse => {
                    const responseUrl = answerResponse.data.url
  
                    embedTitle =  ctx._locale('commands:userInteraction.biteTitle', { user: member.username, member: author.username})
  
                    const embed = new EmbedBuilder()
                    embed.setTitle(embedTitle)
                    embed.setColor('DEFAULT')
                    embed.setImage(responseUrl, 1024, 1024)
                    embed.setFooter(`©️ ${ctx.client.user.username}`)
                    embed.setTimestamp()
    
                    ctx.sendT(responseUrl)
                  })
              })
            })
        })
      }
    }