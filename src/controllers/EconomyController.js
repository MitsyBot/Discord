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

	checkClaim(lastClaim) {
		return Date.now() - lastClaim < DAILY_INTERVAL;
	}

	formatClaimTime(lastClaim) {
		return moment.duration(DAILY_INTERVAL - (Date.now() - lastClaim)).format('h[h] m[m] s[s]');
	}

	async claimDaily(_user) {
		const user = await this.client.database.user.ensureUserInfos(_user);
		const { cooldowns } = user;

		if (this.checkClaim(cooldowns.last_daily)) {
			throw new DailyCooldownError(cooldowns.last_daily, this.formatClaimTime(cooldowns.last_daily));
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

	async transfer(_from, _to, amount) {
		const { profile } = await this.client.database.user.ensureProfile(_from);
		if (profile.comets < amount) return { sucess: false };
		await Promise.all([
			this.client.database.user.removeComets(_from, amount),
			this.client.database.user.addComets(_to, amount),
		]);
		return { sucess: true };
	}

	async balance(_user) {
		const { profile } = await this.client.database.user.ensureProfile(_user);
		return profile.comets;
	}
};