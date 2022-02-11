const { Controller } = require('../');

const moment = require('moment');

// Daily
class DailyCooldownError extends Error {
	constructor(lastClaim, formattedCooldown) {
		super('ALREADY_CLAIMED');
		this.lastClaim = lastClaim;
		this.formattedCooldown = formattedCooldown;
	}
}

const DAILY_INTERVAL = 24 * 60 * 60 * 1000;
class DailyController extends Controller {
	constructor(parent, client) {
		super({
			name: 'daily',
			parent,
		}, client);
	}

	get _users() {
		return this.client.database.users;
	}

	checkClaim(lastClaim) {
		return Date.now() - lastClaim < DAILY_INTERVAL;
	}

	formatClaimTime(lastClaim) {
		return moment.duration(DAILY_INTERVAL - (Date.now() - lastClaim)).format('h[h] m[m] s[s]');
	}

	async claimDaily(_user) {
		const user = await this._users.findOne(_user, 'comets lastDaily');
		const { lastDaily } = user;

		if (this.checkClaim(lastDaily)) {
			throw new DailyCooldownError(lastDaily, this.formatClaimTime(lastDaily));
		}

		return true;
	}
}

// Economy
module.exports = class EconomyController extends Controller {
	constructor(client) {
		super({
			name: 'economy',
		}, client);
		this.subcontrollers = [new DailyController(this, client)];
	}

	canLoad() {
		return !!this.client.database;
	}

	get _users() {
		return this.client.database.users;
	}

	async transfer(_from, _to, amount) {
		const from = await this._users.findOne(_from, 'comets');
		if (from.comets < amount) return { sucess: false };
		await Promise.all([
			this._users.update(_from, { $inc: { comets: -amount } }),
			this._users.update(_to, { $inc: { comets: amount } }),
		]);
		return { sucess: true };
	}

	async balance(_user) {
		const { comets } = await this._users.findOne(_user, 'comets');
		return comets;
	}
};