const { MitsyEmbed } = require('../../../');
const { Song, Playlist } = require('../../music/structures');

module.exports = class PlayCommand {
	static async run(ctx) {

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
			loadSongs(ctx, voiceState.channel, result, playerManager);
		}
		else {
			ctx.makeMessage({ content: ctx.locale('music:songNotFound') });
		}
	}
};

function loadSongs(ctx, voiceChannel, res, playerManager) {
	if (res instanceof Song) {
		songFeedback(ctx, res, true, true);
		return playerManager.play(res, voiceChannel);
	}
	else if (res instanceof Playlist) {
		playlistFeedback(ctx, res);
		return Promise.all(res.songs.map(song => {
			songFeedback(ctx, song, false, true);
			return playerManager.play(song, voiceChannel);
		}));
	}
	else {
		return Promise.reject(new Error('Invalid song instance.'));
	}
}

function playlistFeedback(ctx, playlist) {
	const duration = `\`(${playlist.formattedDuration})\``;
	const count = playlist.songs.length;
	const playlistName = `[${playlist.title}](${playlist.uri})`;

	const embed = new MitsyEmbed()
		.setThumbnail(playlist.artwork)
		.setDescription(`▶️ ${ctx.locale('music:addedFromPlaylist', { count, playlistName, duration })}`);

	ctx.send({ embeds: [embed] });
}

function songFeedback(ctx, song, queueFeedback = true, startFeedback = true) {
	const duration = song.isStream ? `(${ctx.locale('music:live')})` : `\`(${song.formattedDuration})\``;
	const songName = `[${song.title}](${song.uri}) ${duration}`;

	song.on('end', () => ctx.interaction.channel.send(ctx.locale('commands:play.queueEnd', { songName })));
	song.once('stop', u => ctx.interaction.channel.send(ctx.locale('commands:play.queueEmpty', { u })));
	song.once('abruptStop', () => ctx.interaction.channel.send(ctx.locale('commands:play.leaveInactivity')));

	if (startFeedback) {
		song.on('start', () => ctx.makeMessage({ content: ctx.locale('commands:play.startedPlaying', { songName }) }));
	}

	if (queueFeedback) {
		song.once('queue', () => ctx.makeMessage({ content: ctx.locale('commands:play.addedtoqueue', { songName }) }));
	}
}