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

		moment.locale('pt-br');
		const today = moment().format('DD/MM/YYYY');
		const usersWithBirthdayToday = await this.database.user.getTodayBirthdays(today);

		const peopleWhoseBDisToday = new Map();

		Promise.all(this.guilds.map(async guild => {
			const members = await guild.members.fetch(usersWithBirthdayToday);

			if (!members) {return;}

			for (const member of Array.isArray(members) ? member : [member]) {
				if (!peopleWhoseBDisToday.has(members)) {peopleWhoseBDisToday.set(members, new Set());}

				peopleWhoseBDisToday.get(members).add(guild);
			}
		}));

		console.log(peopleWhoseBDisToday);
	}
};