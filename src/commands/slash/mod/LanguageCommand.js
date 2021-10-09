const { Command, EmbedBuilder, Emoji, ResponseAck } = require('../../../utils')
const { CommandBase } = require('eris')
const SelectionMenu = require('../../../structures/interactions/SelectionMenu');
const Options = require("../../../structures/interactions/Options")
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
      }],
      slash: new CommandBase()
        .setName('language')
        .setDescription('Mude o idioma do bot.')
    })
  }

  async run(ctx) {
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setAuthor(ctx._locale('commands:language.message'), ctx.message.author.avatarURL)
    embed.setDescription(`${Emoji.getEmoji('brazil').mention} **Português, Brasil**`)
    embed.addField(ctx._locale('commands:language.helpUs'), ctx._locale('commands:language.explaining'))
    const selectionMenu = new SelectionMenu()
      .addItem(
        new Options()
          .addEmoji({
            name: Emoji.getEmoji('brazil').mention
          })
          .setLabel('Português, Brasil')
          .setValue('br'),

      )
      .addPlaceHolder(ctx._locale('commands:language.chooseYourLanguage'))
      .setCustomID('language-select')
    ctx
      .interaction()
      .components(selectionMenu)
      .returnCtx()
      .send(embed.build()).then(async message => {
        const ack = new ResponseAck(message)

        ack.on('collect', ({ messageCollect, interaction }) => {
          if (message.id === messageCollect.id && interaction.buttonEvent.member.id === ctx.message.author.id) {
            selectionMenu.isDisable()
            switch (interaction.values[0]) {
              case 'br': {
                ctx.db.guild.lang = 'pt-BR'
                ctx.db.guild.save().then(() => {
                  ack.sendAck('update', {
                    content: ctx.replyTData('success', 'agora eu irei falar em `Português, Brasil`.').content,
                    embeds: [],
                    components: []
                  })
                })
              }
                break
            }

          }
        })

      })
  }
}
