const { InteractionCommand, MitsyEmbed } = require('../../');
const { Song, Playlist } = require('../../media/music/structures');

module.exports = class PlayInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'play',
			description: 'Toque uma musica em um canal de voz (Premium).',
			category: 'music',
			options: [
				{
					name: 'link',
					description: 'Link ou nome da musica',
					type: 'STRING',
					required: true,
				},
			],
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

		if (!voiceState.joinable && ctx.interaction.guild.me.voice.channelID !== voiceState.channelID) {
			return ctx.makeMessage({ content: ctx.locale('errors:voiceChannelJoin') });
		}
		let identifier = ctx.options.getString('link', true);
		identifier = identifier.replace(/<?>?/g, '');
		identifier = `ytsearch:${identifier}`;
		const playerManager = ctx.client.playerManager;

		const { result } = await playerManager.loadTracks(identifier, member);
		if (result) {
			PlayInteractionCommand.loadSongs({ t: ctx.locale, ctx, voiceChannel: voiceState.channel }, result, playerManager);
		}
		else {
			ctx.makeMessage({ content: ctx.locale('music:songNotFound') });
		}
	}

	static loadSongs({ t, ctx, voiceChannel }, res, playerManager) {
		if (res instanceof Song) {
			PlayInteractionCommand.songFeedback({ t, ctx }, res, true, true);
			return playerManager.play(res, voiceChannel);
		}
		else if (res instanceof Playlist) {
			PlayInteractionCommand.playlistFeedback({ t, ctx }, res, t);
			return Promise.all(res.songs.map(song => {
				PlayInteractionCommand.songFeedback({ t, ctx }, song, false, true);
				return playerManager.play(song, voiceChannel);
			}));
		}
		else {
			return Promise.reject(new Error('Invalid song instance.'));
		}
	}

	static playlistFeedback({ t, ctx }, playlist) {
		const duration = `\`(${playlist.formattedDuration})\``;
		const count = playlist.songs.length;
		const playlistName = `[${playlist.title}](${playlist.uri})`;
		ctx.makeMessage({ embeds: [
			new MitsyEmbed()
				.setThumbnail(playlist.artwork)
				.setDescription(`▶️ ${t('music:addedFromPlaylist', { count, playlistName, duration })}`),
		] });
	}

	static songFeedback({ t, ctx }, song, queueFeedback = true, startFeedback = true) {
		const bEmbed = (d, u) => new MitsyEmbed(u).setDescription(d);
		const send = (d, u) => ctx.interaction.channel.send(bEmbed(d, u));
		const sendWI = (d, i, u) => ctx.interaction.channel.send(bEmbed(d, u).setThumbnail(i || song.artwork));

		const duration = song.isStream ? `(${t('music:live')})` : `\`(${song.formattedDuration})\``;
		const songName = `[${song.title}](${song.uri}) ${duration}`;

		song.on('end', () => send(`⏹️ ${t('music:hasEnded', { songName })}`));
		song.once('stop', u => send(`⏹️ ${t('music:queueIsEmpty')}`, u));
		song.once('abruptStop', () => send(`⏹️ ${t('music:leftDueToInactivity')}`));

		if (startFeedback) {
			song.on('start', () => sendWI(`▶️ ${t('music:startedPlaying', { songName })}`));
		}

		if (queueFeedback) {
			song.once('queue', () => sendWI(`▶️ ${t('music:addedToTheQueue', { songName })}`));
		}
	}
};
