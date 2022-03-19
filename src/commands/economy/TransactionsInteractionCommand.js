const { InteractionCommand, MitsyEmbed } = require('../../');
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
				{
					name: 'pagina',
					description: 'A pagina das suas transação (opcional)',
					type: 'INTEGER',
					required: false,
					minValue: 1,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const user = ctx.data.user ?? ctx.data.author;

		const page = ctx.options.getInteger('valor', true);

		let skipNumber = page - 1 * 10;
		let takeNumber = page * 10;
		if (page === 0) {
			skipNumber = 0;
			takeNumber = 10;
		}
		const userTransactions = await ctx.client.database.transactions.findMany({
			skip: skipNumber,
			take: takeNumber,
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

		let description = '';

		await userTransactions.forEach(async (transaction) => {
			let substring = '';
			// eslint-disable-next-line no-undef

			substring = substring + `\`\`[${transaction.given_at}]\`\` `;

			const received = Boolean(transaction.received_by === user.general.id);

			let emoji;

			if (received) emoji = '\uD83D\uDCB5';
			else emoji = '\uD83D\uDCB8';

			substring = substring + emoji;
			substring = substring + ' ';

			if (transaction.reason === 'PAYMENT') {
				let receivedByUserId;

				if (received) {
					receivedByUserId = transaction.given_by;
				}
				else {
					receivedByUserId = transaction.received_by;
				}

				const receivedByUser = await ctx.client.users.fetch(receivedByUserId);

				const name = (`${receivedByUser.username}#${receivedByUser?.discriminator} (${receivedByUser?.id})`);

				if (received) {
					substring = substring + ctx.locale('commands:transactions.received', { name, quantity: transaction.quantity });
				}
				else {
					substring = substring + ctx.locale('commands:transactions.sent', { name, quantity: transaction.quantity });
				}
			}
			else {
				const type = ctx.locale(`types:${transaction.reason}`);


				if (received) {substring = substring + ctx.locale('commands:transactions.genericReceive', { type, quantity: transaction.quantity });}
				else { substring = substring + ctx.locale('commands:transactions.genericSent', { type, quantity: transaction.quantity }); }
			}

			substring = substring + '\n';
			description = description + substring;
			console.log('🚀 ~ file: TransactionsInteractionCommand.js ~ line 88 ~ TransactionsInteractionCommand ~ userTransactions.forEach ~ substring', substring);
		},
		);

		console.log('🚀 ~ file: TransactionsInteractionCommand.js ~ line 94 ~ TransactionsInteractionCommand ~ run ~ description', description);

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:transactions.title'))
			.setDescription(description);

		ctx.makeMessage({ embeds: [embed] });
	}
};
