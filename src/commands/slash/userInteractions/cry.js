const { Command, EmbedBuilder, Emoji } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')
const axios = require('axios')

module.exports = class RepCommand extends Command {
  constructor() {
    super({
      name: 'cry',
      aliases: ['choro'],
      hasUsage: false,
      slash: new CommandBase()
        .setName('cry')
        .setDescription('Mostre sua tristeza para todo o servidor!')
    })
  }

        async run(ctx) {    
            const author = ctx.message.author
            let embedTitle = ''

            axios({
                url: 'https://mitsy.website/api/v2/userinteraction/cry',
                method: 'GET',
            }).then(response => {
                const url = response.data.url

                embedTitle = ctx._locale('commands:userInteraction.cryTitle', { user: author.username })

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