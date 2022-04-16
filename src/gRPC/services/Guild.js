module.exports = class GuildService {
	constructor(client) {
		this.client = client;
	}
	checkCommon(call, callback) {
		const { guild } = call.request;
		console.log(call);
		const common = this.client.guilds.cache.has(guild);
		console.log(common);
		const response = {
			common: common,
		};
		callback(null, response);
	}
};