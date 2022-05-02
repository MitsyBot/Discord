const { Loader } = require('../');
const Redis = require('ioredis');
const Client = require('../database/redis/Client');
module.exports = class RedisLoader extends Loader {
	constructor(client) {
		super({
			preLoad: true,
		}, client);

		this.redis = null;
	}

	async load() {
		try {
			await this.initializeRedis();
			this.client.redis = this.redis;
			return this.redis;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}

	async initializeRedis() {
		try {
			const redis = new Redis({
				port: process.env.REDIS_PORT,
				host: process.env.REDIS_HOST,
				password: process.env.REDIS_PASSWORD,
				db: 0,
			});

			this.redis = new Client(redis);

			redis.once('connect', () => {
				this.client.logger.info({ tag: 'Cache' }, 'Redis conectado com sucesso');
			});

			redis.on('end', () => {
				this.redisClient = null;
				this.client.logger.error({ tag: 'Cache' }, 'A database redis se desconectou');
			});
		}
		catch (err) {
			this.client.logger.error({ tag: 'Cache' }, err);
			this.redisClient = null;
			throw err;
		}
	}
};