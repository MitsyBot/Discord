const { InteractionCommand } = require('../../');
module.exports = class LevelInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'criarparty',
			description: 'Crie uma party do youtube together',
			category: 'level',
			cooldown: 5,
		});
	}

	async run(ctx) {

		const user = ctx.data.user ?? ctx.data.author;
		const member = ctx.interaction.guild.members.cache.get(user.id);
		const voiceState = member ? member.voice : null;
		if (!voiceState.channelId) {
			return ctx.makeMessage({ content: ctx.locale('errors:notInVoice') });
		}

		const youtube = await ctx.client.media.interactions.youtube.createTogetherCode(member.voice.channel.id, 'youtube');
		ctx.makeMessage({ content: youtube.code });
	}
};
