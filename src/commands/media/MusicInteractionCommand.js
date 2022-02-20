const { InteractionCommand } = require('../../');
const { PlayCommand } = require('../../media/commands/Music/');
module.exports = class PlayInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'music',
			description: 'Toque uma musica em um canal de voz (Premium).',
			category: 'media',
			options: [
				{
					name: 'play',
					description: 'Toque musica ou adicione a fila',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'link',
							description: 'Link ou nome da musica',
							type: 'STRING',
							required: true,
						},
					],
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const type = ctx.options.getSubcommand();

		if (!type) return PlayCommand.run(ctx);

		if (type === 'play') return PlayCommand.run(ctx);
	}
};
