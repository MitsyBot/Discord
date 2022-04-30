const { startGRPCServer } = require('../gRPC/server');
const { Loader } = require('../');

module.exports = class gRPCLoader extends Loader {
	constructor(client) {
		super({
			preLoad: true,
		}, client);
	}

	async load() {
		try {
			startGRPCServer(this.client);
			return true;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}
};