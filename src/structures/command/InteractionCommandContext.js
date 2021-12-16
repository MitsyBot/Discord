module.exports = class InteractionCommandContext {

	constructor(options = {}) {
		this.client = options.client;
		this.data = options.data;
		this.t = options.t;
		this.interaction = options.interaction;
	}

	setFixedT(translate) {
		this.t = translate;
	}
};