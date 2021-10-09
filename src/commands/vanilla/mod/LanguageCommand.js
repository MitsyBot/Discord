const { Command, EmbedBuilder, ReactionCollector, Emoji } = require('../../../utils')

module.exports = class LanguageCommand extends Command {
  constructor() {
    super({
      name: 'language',
      aliases: ['lang', 'idioma'],
      permissions: [{
        entity: 'user',
        permissions: ['manageGuild']
      }, {
        entity: 'bot',
        permissions: ['embedLinks', 'addReactions']
      }]
    })
  }

  async run(ctx) {
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setAuthor(ctx._locale('commands:language.message'), ctx.message.author.avatarURL)
    embed.setDescription('🇧🇷 **Português, Brasil**')
    embed.addField(ctx._locale('commands:language.helpUs'), ctx._locale('commands:language.explaining'))

    ctx.send(embed.build()).then(async message => {
      await message.addReaction(Emoji.getEmoji('brazil').reaction)


      const filter = (_, emoji, userID) => ([Emoji.getEmoji('brazil').name].includes(emoji.name)) && userID === ctx.message.author.id
      const collector = new ReactionCollector(message, filter, { max: 1 })
      collector.on('collect', async (_, emoji) => {
        switch (emoji.name) {
          case '🇧🇷': {
            ctx.db.guild.lang = 'pt-BR'
            ctx.db.guild.save().then(() => {
              message.delete()
              ctx.reply('success', 'agora eu irei falar em `Português, Brasil`.')
            })
          }
            break
        }
      })
    })
  }
}
