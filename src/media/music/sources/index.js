module.exports = {
	Songs: {
		SoundcloudSong: require('./soundcloud/SoundcloudSong.js'),

		TwitchSong: require('./twitch/TwitchSong.js'),

		YoutubePlaylist: require('./youtube/YoutubePlaylist.js'),
		YoutubeSong: require('./youtube/YoutubeSong.js'),
	},
	Sources: {
		SpotifySongSource: require('./spotify/SpotifySoundSource'),
	},
};