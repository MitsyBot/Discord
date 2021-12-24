class DBWrapper {
	constructor(options = {}) {
		if (this.constructor === DBWrapper) throw new Error('Cannot instantiate abstract class');
		this.options = options;
	}

	// eslint-disable-next-line no-empty-function
	connect() {}
}

DBWrapper.envVars = [];

module.exports = DBWrapper;