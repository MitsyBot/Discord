const { Controller, MitsyEmbed } = require('../');
const { WebhookClient } = require('discord.js');
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
		const { profile } = await this.client.database.user.ensureUserInfos(_from.id);
		if (profile.comets < amount) return { sucess: false };
		await Promise.all([
			this.client.database.user.removeComets(_from.id, amount),
			this.client.database.user.addComets(_to.id, amount),
		]);

		const transaction = await this.client.database.transactions.create({
			data: {
				reason: 'PAYMENT',
				given_by: _from.id,
				received_by: _to.id,
				quantity: amount,
				given_at: Date.now(),
			},
		});

		const starTrackerHook = new WebhookClient({ id: process.env.STARTRACKER_ID, token: process.env.STARTRACKER_TOKEN });
		const embed = new MitsyEmbed()
			.setTitle('<:Mitsy_Rica:872870327049396274> **${amount} for PAYMENT**')
			.addFields(
				{ name: '**💸 Quem pagou**', value: `${_from.id}\n \`\`${_from.username}\`\`` },
				{ name: '**💵 Quem recebeu**', value: `${_to.id}\n \`\`${_to.username}\`\`` },
			)
			.setFooter({ text: `Transação ${transaction.id}`, iconURL: 'https://cdn.discordapp.com/emojis/873019423827587132.webp' });

		starTrackerHook.send({
			username: 'StarTracker',
			embeds: [embed],
		});

		return { sucess: true };
	}

	async balance(_user) {
		const { profile } = await this.client.database.user.ensureUserInfos(_user);
		return profile.comets;
	}
};