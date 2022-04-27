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
		const member = ctx.interaction.guild.members.cache.get(ctx.interaction.user.id);
		const voiceState = member ? member.voice : null;
		if (!voiceState.channelId) {
			return ctx.makeMessage({ content: ctx.locale('errors:notInVoice') });
		}

		const youtube = await ctx.client.youtubetogether.createTogetherCode(voiceState.channelId, 'youtube');
		ctx.makeMessage({ content: ctx.locale('commands:youtube.join', { code: youtube.code }) });
	}
};
