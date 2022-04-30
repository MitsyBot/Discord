module.exports = class GuildService {
	constructor(client) {
		this.client = client;
	}
	checkCommon(call, callback) {
		const { guild } = call.request;
		const common = this.client.guilds.cache.has(guild);
		const response = {
			common,
		};
		callback(null, response);
	}
};