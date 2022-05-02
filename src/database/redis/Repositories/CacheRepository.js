module.exports = class CacheRepository {
	constructor(
		redisClient,
	) {
		this.redisClient = redisClient;
	}

	async getRouletteUsages(userId) {
		if (!this.redisClient) return 0;
		const res = await this.redisClient.get(`roulette:${userId}`);
		if (!res) return 0;
		return Number(res);
	}

	async incrementRouletteHourlyUsage(userId) {
		if (!this.redisClient) return;

		const expireTime = (60 - new Date().getMinutes()) * 60;

		await this.redisClient
			.multi()
			.incr(`roulette:${userId}`)
			.expire(`roulette:${userId}`, expireTime)
			.exec();
	}
};