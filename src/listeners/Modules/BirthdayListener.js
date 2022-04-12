const { EventListener, MitsyEmbed } = require('../../');
const moment = require('moment');
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

		setInterval(async () => {
			moment.locale('pt-br');
			const today = moment().format('DD/MM/YYYY');
			const usersWithBirthdayToday = await this.database.user.getTodayBirthdays(today);
			console.log(usersWithBirthdayToday);
			const peopleWhoseBDisToday = new Map();

			Promise.all(this.guilds.cache.map(async guild => {
				const members = await guild.members.fetch(usersWithBirthdayToday);
				if (!members) {return;}
				console.log('members');
				// eslint-disable-next-line no-unused-vars
				for (const member of Array.isArray(members) ? members : [members]) {
					if (!peopleWhoseBDisToday.has(members)) {peopleWhoseBDisToday.set(members, new Set());}
					console.log(member);
					peopleWhoseBDisToday.get(member).add(guild);
				}
			}));
			console.log(peopleWhoseBDisToday);
		}, 1000 * 30);

	}
};