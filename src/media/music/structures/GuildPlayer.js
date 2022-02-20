const { Collection } = require('discord.js');
const { Player } = require('@lavacord/discord.js');
const moment = require('moment');

module.exports = class GuildPlayer extends Player {
	constructor(node, id) {
		super(node, id);

		this.on('end', ({ reason }) => {
			this.scrobbleSong(this.playingSong);
			if (reason === 'REPLACED') return;
			this.playingSong.emit('end');
			if (reason !== 'STOPPED') this.next();
		});

		this.on('stop', () => {
			this.playingSong = null;
			this.manager.leave(this.id);
		});

		this.on('error', (e) => this.manager.client.logger.error(e));

		this.queue = [];
		this._volume = 100;
		this._loop = false;

		this._previousVolume = null;
		this._bassboost = false;

		this._listening = new Collection();
	}

	async play(song, forcePlay = false) {
		if (this.playing && !forcePlay) {
			this.queueTrack(song);
			return false;
		}

		await super.play(song.track);
		this.playingSong = song;
		this.volume(this._volume);
		song.emit('start');
		return true;
	}

	stop() {
		this.queue = [];
		this._listening.clear();
		this.emit('stop');
		super.stop();
	}

	leaveOnEmpty(user) {
		this.playingSong.emit('abruptStop', user);
		this.stop();
	}

	next(user) {
		if (this._loop) this.queueTrack(this.playingSong, true);
		const nextSong = this.queue.shift();
		if (nextSong) {
			this.play(nextSong, true);
			this.updateListening();
			this.updateNowPlaying();
			return nextSong;
		}
		else {
			super.stop();
			this.playingSong.emit('stop', user);
			this.emit('stop', user);
		}
	}

	// Queue
	get nextSong() {
		return this.queue[0];
	}

	queueTrack(song, silent = false) {
		this.queueTracks([song], silent);
		return song;
	}

	queueTracks(songs, silent = false) {
		this.queue.push(...songs);
		if (!silent) songs.forEach(s => s.emit('queue'));
		return songs;
	}

	clearQueue() {
		return this.queue.splice(0);
	}

	shuffleQueue() {
		this.queue = this.queue.sort(() => Math.random() > 0.5 ? -1 : 1);
	}

	removeFromQueue(index) {
		if (index < 0 || index >= this.queue.length) throw new Error('INDEX_OUT_OF_BOUNDS');
		return this.queue.splice(index, 1)[0];
	}

	jumpToIndex(index, ignoreLoop = false) {
		if (index < 0 || index >= this.queue.length) throw new Error('INDEX_OUT_OF_BOUNDS');

		const songs = this.queue.splice(0, index + 1);
		const song = songs.pop();
		if (!ignoreLoop && this._loop) this.queueTracks([this.playingSong, ...songs]);
		this.play(song, true);

		return song;
	}

	// Volume

	volume(volume = 100) {
		this._volume = volume;
		super.volume(volume);
	}

	get bassboosted() {
		return this._bassboost;
	}

	bassboost(state = true) {
		this._bassboost = state;
		if (state) {
			this._previousVolume = this._volume;
			this.volume(150);
			this.equalizer(Array(6).fill(0).map((_, i) => ({ band: i, gain: 1 })));
			return true;
		}

		if (this._previousVolume !== null) this.volume(this._previousVolume);
		this.equalizer(Array(6).fill(0).map((_, i) => ({ band: i, gain: 0 })));
		return false;
	}

	get looping() {
		return this._loop;
	}

	loop(loop = true) {
		this._loop = !!loop;
	}

	// Helpers

	get formattedElapsed() {
		if (!this.playingSong || this.playingSong.isStream) return '';
		return moment.duration(this.state.position).format('hh:mm:ss', { stopTrim: 'm' });
	}

	get voiceChannel() {
		return this.client.channels.get(this.channel);
	}

	updateListening() {
		this._listening.forEach(({ scrobblePercent }, k) => this._listening.set(k, { join: new Date(), scrobblePercent }));
	}
};