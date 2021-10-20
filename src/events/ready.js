const client = require('../bot');
const chalk = require('chalk');

client.on('ready', () => {
	console.log(
		`${chalk.greenBright(
			`[${client.user.username}]`,
		)} foi iniciada corretamente e está online!`,
	);
});
