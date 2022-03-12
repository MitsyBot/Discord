const { Client, Collection } = require('discord.js');
const Loaders = require('./loaders');
const Logger = require('./utils/Logger/Logger');

module.exports = class MitsyClient extends Client {
	constructor(options = {}) {
		super(options);
		this.shardId = options.shardId;
		this.logger = new Logger();
		this.maintenance = {};
		this.cooldowns = new Collection();
		this.commandExecutions = new Set();

		this.loaded = false;
	}


	async initialize() {
		const loaders = Object.values(Loaders).map(L => new L(this));
		const [preLoad, normal] = loaders.reduce(([pl, n], l) => (l.preLoad ? [[...pl, l], n] : [pl, [...n, l]]), [[], []]);

		for (const l of preLoad) {
			await this.initializeLoader(l);
		}

		await this.login()
			.then(() => this.logger.info({ tag: 'Discord' }, 'Bot logado com sucesso!'))
			.catch((e) => this.logger.error(e));

		for (const l of normal) {
			await this.initializeLoader(l);
		}

		this.loaded = true;
	}

	async initializeLoader(loader) {
		let success = false;
		try {
			success = await loader.load();
		}
		catch (e) {
			this.logger.error(e);
		}
		finally {
			if (!success && loader.critical) process.exit(1);
		}
	}

	async ShardingEnded() {
		if (!this.shard) return false;
		return this.shard
			.broadcastEval((c) => c.isReady())
			.catch(() => false)
			.then(() => true);
	}

	login(token = process.env.BOT_TOKEN) {
		return super.login(token);
	}
};