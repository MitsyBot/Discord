const { CacheRepository } = require('./Repositories');
module.exports = class RedisClient {
	constructor(client) {
		this.client = client;
		this.cache = new CacheRepository(client);
	}
};