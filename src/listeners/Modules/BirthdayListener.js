const { EventListener } = require('../../');
const moment = require('moment');
// const CronJob = require('cron').CronJob;

module.exports = class BirthdayListener extends EventListener {
	constructor(client) {
		super({
			events: ['ready'],
		}, client);
	}

	// Aqui eu criei um evento de ready ou seja quando o bot iniciar ele vai começar a rodar o que tiver aqui em baixo
	// Eu criei um cronjob que vai rodar a cada 24 horas
	// TMJ COPILOT

	// SIM


	async onReady() {
		/* const job = new CronJob('0 24 * * *', async () => {
			// O que tiver aqui dentro vai rodar a cada 24h

			// Aqui eu pego a data atual
			// Se eu fizer o today fora do job ele vai ser constante
			// Por isso ele ta aqui dentro
			// Aqui eu pego todos os usuarios que tem aniversario hoje

		}, null, true, 'America/Sao_Paulo'); */


		// esqueci como comenta foda....
		// esqueci nada só tinha um bgl que fecha o coment la
		// job.start();

		const today = moment().format('DD/MM/YYYY');
		const usersWithBirthdayToday = this.database.user.getTodayBirthdays(today);
		console.log(usersWithBirthdayToday);
	}
};