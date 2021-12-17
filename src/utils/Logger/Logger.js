const bunyan = require('bunyan');
const Stream = require('./Stream');

module.exports = class Logger {
	constructor() {
		const streams = [];
		const level = process.env.DEBUG === 'true' ? 'trace' : 'info';

		if (process.env.NODE_ENV !== 'production') {
			streams.push({
				type: 'raw',
				stream: new Stream(),
				level,
			});
		}

		this.bunyan = bunyan.createLogger({
			name: 'mitsy',
			level,
			streams,
		});
	}

	fatal(...args) {
		this.bunyan.fatal(...args);
	}

	error(...args) {
		this.bunyan.error(...args);
	}

	warn(...args) {
		this.bunyan.warn(...args);
	}

	info(...args) {
		this.bunyan.info(...args);
	}

	debug(...args) {
		this.bunyan.debug(...args);
	}

	trace(...args) {
		this.bunyan.trace(...args);
	}
};