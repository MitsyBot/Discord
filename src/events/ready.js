const mongoose = require('mongoose');
const client = require('../bot');
const chalk = require('chalk');

client.on('ready', () => {
	console.log(
		`${chalk.greenBright(
			`[${client.user.username}]`,
		)} foi iniciada corretamente e está online!`,
	);

	mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
		if (err) {
			return console.log(chalk.redBright('[DATABASE]') + ` Não foi possível se conectar a database: ${err}`);
		}

		console.log(chalk.greenBright('[DATABASE]') + ' Conectado a database');
	});
});
