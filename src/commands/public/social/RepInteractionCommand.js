const { InteractionCommand } = require('../../../');

module.exports = class LevelInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'rep',
			description: 'Envie uma reputação para um usuário.',
			category: 'social',
			options: [
				{
					name: 'usuário',
					type: 'USER',
					usage: '/rep Duuuuardo',
					description: 'Mencione um usuário',
					required: false,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {

		const member = ctx.options.getUser('usuário');
		const author = ctx.author;
		if (!member) {
			await ctx.makeMessage({ content: ctx.prettyResponse('error', 'commands:rep.noUser') });
			return;
		}

		if (member.id === author.id) {
			await ctx.makeMessage({ content: ctx.prettyResponse('error', 'commands:rep.self') });
			return;
		}

		ctx.makeMessage({ content: ctx.prettyResponse('info', 'commands:rep.link', { user: member.id, author: author.id, channel: ctx.interaction.channel.id, guild: ctx.interaction.guild.id }) });
	}
};
