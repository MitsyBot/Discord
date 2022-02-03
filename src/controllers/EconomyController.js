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
		const user = await this._users.findOne(_user, 'money lastDaily');
		const { lastDaily } = user;

		if (this.checkClaim(lastDaily)) {
			throw new DailyCooldownError(lastDaily, this.formatClaimTime(lastDaily));
		}

		const collectedMoney = Math.ceil(Math.random() * 2000) + 750;
		await this._users.update(_user, { $inc: { money: collectedMoney }, lastDaily: Date.now() });

		return { collectedMoney };
	}

	async claimDBLDaily(_user) {
		const collectedMoney = 250;
		await this._users.update(_user, { $inc: { money: collectedMoney } });
		return { collectedMoney };
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
		const from = await this._users.findOne(_from, 'money');
		if (from.money < amount) throw new Error('NOT_ENOUGH_MONEY');
		await Promise.all([
			this._users.update(_from, { $inc: { money: -amount } }),
			this._users.update(_to, { $inc: { money: amount } }),
		]);
	}

	async balance(_user) {
		const { money } = await this._users.findOne(_user, 'money');
		return money;
	}
};