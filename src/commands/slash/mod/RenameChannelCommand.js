const { Command } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')

module.exports = class RenameChannelCommand extends Command {
  constructor() {
    super({
      name: 'renamechannel',
      aliases: ['renomearcanal'],
      hasUsage: true,
      permissions: [{
        entity: 'both',
        permissions: ['manageChannels']
      }],
      arguments: 1,
      slash: new CommandBase()
        .setName('renamechannel')
        .setDescription('Renomeia um canal do servidor.')
        .addOptions(
          new CommandOptions()
            .setName('channel')
            .setDescription('Mencione o canal.')
            .setType(7)
            .isRequired(),
          new CommandOptions()
            .setName('name')
            .setDescription('O novo nome do canal.')
            .setType(3)
            .isRequired()
        )
    })
  }

  run(ctx) {
    const guild = ctx.message.guild
    const channel = guild.channels.get(ctx.args.get('channel').value)
    const name = ctx.args.get('name').value.replace('&', '＆').replace('|', '│')
    if (!channel) return ctx.replyT('error', 'commands:renamechannel.channelNotFound')
    if (!name) return ctx.replyT('error', 'commands:renamechannel.invalidName')
    channel.edit({
      name
    }).then((channel) => {
      ctx.replyT('success', 'commands:renamechannel.successfullyRenamed', { 0: channel.name })
    })
  }
}
