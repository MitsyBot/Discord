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
							required: true,
						},
					],
				},
				{
					name: 'stop',
					description: 'Remova todas as musicas de uma fila',
					type: 'SUB_COMMAND',
				},
			],
			cooldown: 5,
		});
	}
	// Run
	async run(ctx) {
		const type = ctx.options.getSubcommand();

		if (!type) return PlayInteractionCommand.play(ctx);

		if (type === 'play') return PlayInteractionCommand.play(ctx);
		if (type === 'stop') return PlayInteractionCommand.stop(ctx);
	}

	static async play(ctx) {
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
			this.loadSongs(ctx, voiceState.channel, result, playerManager);
		}
		else {
			ctx.makeMessage({ content: ctx.locale('music:songNotFound') });
		}
	}

	static async stop(ctx) {
		const user = ctx.data.user ?? ctx.data.author;
		const member = ctx.interaction.guild.members.cache.get(user.id);
		const guildPlayer = this.client.playerManager.players.get(ctx.interaction.guild.id);
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
			.setDescription(`▶️ ${ctx.locale('music:addedFromPlaylist', { count, playlistName, duration })}`);

		ctx.send({ embeds: [embed] });
	}

	songFeedback(ctx, song, queueFeedback = true, startFeedback = true) {
		const duration = song.isStream ? `(${ctx.locale('music:live')})` : `\`(${song.formattedDuration})\``;
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
