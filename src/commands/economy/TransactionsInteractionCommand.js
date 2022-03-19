const { InteractionCommand, MitsyEmbed } = require('../../');
const moment = require('moment');
module.exports = class TransactionsInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'transações',
			description: 'Veja as suas transações ou a de outro usuário',
			category: 'economy',
			options: [
				{
					type: 'USER',
					name: 'usuário',
					description: 'Usuário que deseja ver as transações (opcional)',
					required: false,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const user = ctx.data.user ?? ctx.data.author;
		console.log('🚀 ~ file: TransactionsInteractionCommand.js ~ line 23 ~ TransactionsInteractionCommand ~ run ~ user', user);

		const userTransactions = await ctx.client.database.transactions.findMany({
			where: {
				OR: [
					{
						given_by: user.general.id,
					},
					{
						received_by: user.general.id,
					},
				],
			},
		});
		console.log('🚀 ~ file: TransactionsInteractionCommand.js ~ line 36 ~ TransactionsInteractionCommand ~ run ~ userTransactions', userTransactions);

		let description = '';

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:transactions.title'))
			.setDescription(description);

		for (const transaction in userTransactions) {
			console.log('🚀 ~ file: TransactionsInteractionCommand.js ~ line 44 ~ TransactionsInteractionCommand ~ run ~ transaction', transaction);
			const substring = '';

			substring.concat(`${moment.duration(transaction.given_at).format('DD-MM-YYYY hh:mm')} `);

			const received = Boolean(transaction.received_by === user.general.id);

			let emoji;

			if (received) emoji = '\uD83D\uDCB5';
			else emoji = '\uD83D\uDCB8';

			substring.concat(emoji);
			substring.concat(' ');

			if (transaction.reason === 'PAYMENT') {
				let receivedByUserId;

				if (received) {
					receivedByUserId = transaction.given_by;
				}
				else {
					receivedByUserId = transaction.received_by;
				}

				const receivedByUser = await Promise.all(ctx.client.shard.broadcastEval(() => ctx.client.users.fetch(receivedByUserId)));

				const name = (`${receivedByUser.username}#${receivedByUser?.discriminator}`);

				if (received) {
					substring.concat(ctx.locale('commands:transactions.received', { name, quantity: transaction.quantity }));
				}
				else {
					substring.concat(ctx.locale('commands:transactions.sent', { name, quantity: transaction.quantity }));
				}
			}
			else {
				const type = ctx.locale(`types:${transaction.reason}`);


				if (received) {substring.concat(ctx.locale('commands:transactions.genericReceive', { type, quantity: transaction.quantity }));}
				else { substring.concat(ctx.locale('commands:transactions.genericSent', { type, quantity: transaction.quantity })); }
			}

			substring.concat('\n');
			console.log('🚀 ~ file: TransactionsInteractionCommand.js ~ line 89 ~ TransactionsInteractionCommand ~ run ~ substring', substring);
			description = description + substring;
		}

		console.log('🚀 ~ file: TransactionsInteractionCommand.js ~ line 94 ~ TransactionsInteractionCommand ~ run ~ description', description);

		ctx.makeMessage({ embeds: [embed] });
	}
};
