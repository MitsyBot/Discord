const { Command, EmbedBuilder, Emoji } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')
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
    
        const author = ctx.message.author
        let embedTitle = ''
    
        axios({
            url: 'https://mitsy.website/api/v2/userinteraction/pat',
            method: 'GET',
        }).then(response => {
            const url = response.data.url
    
            embedTitle = ctx._locale('commands:pat.patTitle', { user: author.username, member: member.username })
    
            const embed = new EmbedBuilder()
            embed.setTitle(embedTitle)
            embed.setColor('DEFAULT')
            embed.setImage(url, 1024, 1024)
            embed.setFooter(`©️ ${ctx.client.user.username}`)
            embed.setTimestamp()
    
            ctx.send(embed.build()).then(message => {
                message.addReaction('💚')
    
                ctx.client.on('messageReactionAdd', async (msg, emoji, reactor) => {
                    if(msg.id !== message.id) return;
                    if(emoji.name !== '💚') return;
                    if(reactor.id !== member.id || reactor.id === ctx.client.user.id || reactor.id === author.id) return; 
    
                    embedTitle =  ctx._locale('commands:pat.patTitle', { user: member.username, member: author.username})
    
                    const embed = new EmbedBuilder()
                    embed.setTitle(embedTitle)
                    embed.setColor('DEFAULT')
                    embed.setImage(url, 1024, 1024)
                    embed.setFooter(`©️ ${ctx.client.user.username}`)
                    embed.setTimestamp()
    
                    ctx.send(embed.build())
                })
            })
        })
      }
    }