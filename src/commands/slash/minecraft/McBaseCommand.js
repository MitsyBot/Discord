const Command = require('../../../structures/command/Command')
const { CommandBase, CommandOptions } = require('eris')


module.exports = class McBaseCommand extends Command {
    constructor() {
        super({
            name: 'mc-base',
            aliases: [],
            arguments: 1,
            hasUsage: false,
            permissions: [{
                entity: 'bot',
                permissions: ['embedLinks']
            }],
            slash: new CommandBase()
                .setName('mc')
                .setDescription('Comando de minecraft')
                .addOptions(
                    new CommandOptions()
                        .setType(1)
                        .setName('avatar')
                        .setDescription('Mostra o avatar de um player de minecraft.')
                        .addOptions(
                            new CommandOptions()
                                .setName('minecraft-nickname')
                                .setDescription('Nome de usuario.')
                                .setType(3)
                                .isRequired(),
                        ),
                    new CommandOptions()
                        .setType(1)
                        .setName('body')
                        .setDescription('Mostra o corpo de um jogador de minecraft.')
                        .addOptions(
                            new CommandOptions()
                                .setName('minecraft-nickname')
                                .setDescription('Nome do usuario.')
                                .setType(3)
                                .isRequired(),
                        ),
                    new CommandOptions()
                        .setType(1)
                        .setName('head')
                        .setDescription('Mostra a cabeça de um jogador de minecraft.')
                        .addOptions(
                            new CommandOptions()
                                .setName('minecraft-nickname')
                                .setDescription('Nome do usuario.')
                                .setType(3)
                                .isRequired(),
                        ),
                    new CommandOptions()
                        .setType(1)
                        .setName('skin')
                        .setDescription('Mostra a skin de um jogador de minecraft.')
                        .addOptions(
                            new CommandOptions()
                                .setName('minecraft-nickname')
                                .setDescription('Nome do usuario.')
                                .setType(3)
                                .isRequired(),
                        ),
                    new CommandOptions()
                        .setType(1)
                        .setName('query')
                        .setDescription('Mostra informações de um servidor de minecraft')
                        .addOptions(
                            new CommandOptions()
                                .setName('minecraft-server-ip')
                                .setDescription('Ip do servidor.')
                                .setType(3)
                                .isRequired(),
                        )
                )
        })
    }
    on(ctx) {

    }
}
