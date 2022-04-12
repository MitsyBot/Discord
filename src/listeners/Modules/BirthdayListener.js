const { EventListener, MiscUtils } = require('../../');
const moment = require('moment');
const { Message } = require('discord.js');
const CronJob = require('cron').CronJob;

module.exports = class BirthdayListener extends EventListener {
	constructor(client) {
		super({
			events: ['ready'],
		}, client);
	}


	async onReady() {
		/* const job = new CronJob('0 24 * * *', async () => {
		}, null, true, 'America/Sao_Paulo');
		job.start(); */

		moment.locale('pt-br');
		const today = moment().format('DD/MM/YYYY');
		let usersWithBirthdayToday = await this.database.user.getTodayBirthdays(today);
		usersWithBirthdayToday = await usersWithBirthdayToday.map((user) => { return user.id; });

		const peopleWhoseBDisToday = new Map();

		setInterval(async () => {
			peopleWhoseBDisToday.clear();
			await Promise.all(this.guilds.cache.map(async guild => {
				const members = await guild.members.fetch({ user: usersWithBirthdayToday });
				if (!members) {return;}
				console.log('members');
				// eslint-disable-next-line no-unused-vars
				for (const member of Array.isArray(members) ? members : [members]) {
					if (!peopleWhoseBDisToday.has(members)) {peopleWhoseBDisToday.set(member, new Set());}
					peopleWhoseBDisToday.get(member).add(guild);
				}
			}));

			for (const [user, guilds] of peopleWhoseBDisToday.entries()) {
				for (const guild of guilds) {
					const database = await this.database.guild.ensure(guild.id);

					if (database.birthday.enabled) {
						const channel = guild.channels.cache.get(database.birthday.channel);

						const values = [
							{
								User: user.username,
								'@User':  `<@${user.id}>`,
							},
						];

						const message = MiscUtils.replacePlaceholders(JSON.stringify(database.birthday.message), values);

						channel.send(message);

					}
				}
			}
		}, 1000 * 30);

	}
};