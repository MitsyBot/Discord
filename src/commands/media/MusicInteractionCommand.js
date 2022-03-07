const { InteractionCommand, MitsyEmbed } = require('../../');
const { Song, Playlist } = require('../../media/music/structures');

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
						},
					],
				},
				{
					name: 'volume',
					description: 'Altere o volume da musica',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'volume',
							description: 'Volume em que eu devo tocar a musica!',
							type: 'INTEGER',
						},
					],
				},
				{
					name: 'stop',
					description: 'Remova todas as musicas de uma fila',
					type: 'SUB_COMMAND',
				},
				{
					name: 'np',
					description: 'Veja o que esta tocando agora',
					type: 'SUB_COMMAND',
				},
			],
			cooldown: 5,
		});
	}
	// Run
	async run(ctx) {
		const type = ctx.options.getSubcommand();

		if (!type) return this.play(ctx);
		if (type === 'volume') return this.volume(ctx);
		if (type === 'np') return this.nowplaying(ctx);

		if (type === 'play') return this.play(ctx);
		if (type === 'stop') return this.stop(ctx);
	}

	async play(ctx) {
		const member = ctx.interaction.guild.members.cache.get(ctx.interaction.user.id);
		const voiceState = member ? member.voice : null;
		console.log(voiceState);
		if (!voiceState.channelId) {
			return ctx.makeMessage({ content: ctx.locale('errors:notInVoice') });
		}

		let identifier = ctx.options.getString('link', true);
		identifier = identifier.replace(/<?>?/g, '');
		identifier = `ytsearch:${identifier}`;
		const playerManager = ctx.client.playerManager;

		const { result } = await playerManager.loadTracks(identifier, member);
		if (result) {
			this.loadSongs(ctx, voiceState.channel, result, playerManager);
		}
		else {
			ctx.makeMessage({ content: ctx.locale('commands:music.songNotFound') });
		}
	}

	nowplaying(ctx) {
		const guildPlayer = ctx.client.playerManager.players.get(ctx.interaction.guild.id);
		const song = guildPlayer.playingSong;
		const embed = new MitsyEmbed(ctx.interaction.author);
		const nf = new Intl.NumberFormat('en-US').format;

		switch (song.source) {
		case 'youtube':
			embed.setImage(song.artwork)
				.addField(ctx.locale('music.views'), nf(song.richInfo.viewCount), true)
				.addField(ctx.locale('music.likes'), nf(song.richInfo.likeCount), true)
				.addField(ctx.locale('commands:music.dislikes'), nf(song.richInfo.dislikeCount), true);
			break;
		case 'twitch':
			embed.setImage(song.richInfo.thumbnailUrl || song.artwork)
				.addField(ctx.locale('commands:music.viewers'), nf(song.richInfo.viewerCount), true)
				.addField(ctx.locale('commands:music.views'), nf(song.richInfo.viewCount), true);
			break;
		case 'soundcloud':
			embed.setImage(song.artwork)
				.addField(ctx.locale('commands:music.played'), nf(song.richInfo.playbackCount) + 'x', true);
			break;
		default:
			embed.setImage(song.artwork);
		}

		let durationText = `\`(${ctx.locale('commands:music.live')})\``;
		if (!song.isStream) {
			durationText = `\`(${guildPlayer.formattedElapsed}/${song.formattedDuration})\``;
		}

		const description = [
			`**${ctx.locale('commands:music.nowPlaying')}:** [${song.title}](${song.uri}) ${durationText}`,
			`*[${ctx.locale('commands:music.addedBy', { user: '<@' + song.requestedBy + '>' })}]*`,
		];

		ctx.makeMessage({ embeds: [embed.setDescription(description.join('\n'))] });
	}

	volume(ctx) {
		const MAX_VOLUME = 500;
		const volume = ctx.options.getInteger('volume', true);

		const guildPlayer = ctx.client.playerManager.players.get(ctx.interaction.guild.id);

		if (volume === MAX_VOLUME) return ctx.makeMessage({ content: ctx.locale('commands:music.volumeInvalid', { volume }) });

		else if (guildPlayer.bassboosted) guildPlayer.bassboost(false);

		guildPlayer.volume(volume);
		ctx.makeMessage({ content: ctx.locale('commands:music.volumeSet', { volume }) });
	}

	stop(ctx) {
		const member = ctx.interaction.guild.members.cache.get(ctx.interaction.user.id);
		const guildPlayer = ctx.client.playerManager.players.get(ctx.interaction.guild.id);
		guildPlayer.stop(member);
		return ctx.makeMessage({ content: ctx.locale('commands:stop.stopped') });
	}

	// Helpers
	loadSongs(ctx, voiceChannel, res, playerManager) {
		if (res instanceof Song) {
			this.songFeedback(ctx, res, true, true);
			return playerManager.play(res, voiceChannel);
		}
		else if (res instanceof Playlist) {
			this.playlistFeedback(ctx, res);
			return Promise.all(res.songs.map(song => {
				this.songFeedback(ctx, song, false, true);
				return playerManager.play(song, voiceChannel);
			}));
		}
		else {
			return Promise.reject(new Error('Invalid song instance.'));
		}
	}

	playlistFeedback(ctx, playlist) {
		const duration = `\`(${playlist.formattedDuration})\``;
		const count = playlist.songs.length;
		const playlistName = `[${playlist.title}](${playlist.uri})`;

		const embed = new MitsyEmbed()
			.setThumbnail(playlist.artwork)
			.setDescription(`▶️ ${ctx.locale('commands:music.addedFromPlaylist', { count, playlistName, duration })}`);

		ctx.send({ embeds: [embed] });
	}

	songFeedback(ctx, song, queueFeedback = true, startFeedback = true) {
		const duration = song.isStream ? `(${ctx.locale('commands:music.live')})` : `\`(${song.formattedDuration})\``;
		const songName = `[${song.title}](${song.uri}) ${duration}`;

		song.on('end', () => ctx.interaction.channel.send(ctx.locale('commands:play.queueEnd', { songName })));
		song.once('stop', u => ctx.interaction.channel.send(ctx.locale('commands:play.queueEmpty', { u })));

		if (startFeedback) {
			song.on('start', () => ctx.makeMessage({ content: ctx.locale('commands:play.startedPlaying', { songName }) }));
		}

		if (queueFeedback) {
			song.once('queue', () => ctx.makeMessage({ content: ctx.locale('commands:play.addedtoqueue', { songName }) }));
		}
	}
};
