module.exports = class PreciseTimeout {
	constructor(time) {
		this.kEndsAt = Date.now() + time;
		this.stopped = false;
		this.resolve = (() => void 0)();
	}

	async run() {
		if (this.stopped) return false;

		const cb = () => {
			if (Date.now() + 10 >= this.kEndsAt) this.stopped = true;
			this.resolve();
			this.resolve = null;
		};

		while (!this.stopped) {
			await new Promise((resolve) => {
				this.resolve = resolve;
				this.timeout = setTimeout(cb, Date.now() - this.kEndsAt + 10);
			});
		}

		return true;
	}

	stop() {
		if (this.stopped) return false;

		this.stopped = true;
		if (this.timeout) clearTimeout(this.timeout);
		if (this.resolve) this.resolve();
		return true;
	}
};