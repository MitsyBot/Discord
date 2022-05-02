const { InteractionCommand, Util, MitsyEmbed } = require('../../../');
const { MessageButton } = require('discord.js');
const moment = require('moment');

module.exports = class CometsInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'coinflip',
			description: 'Dispute num jogo de Cara e Coroa com um amigo',
			category: 'economy',
			options: [
				{
					name: 'user',
					description: 'Usuário para disputar',
					type: 'USER',
					required: true,
				},
				{
					name: 'aposta',
					description: 'Valor da aposta',
					type: 'INTEGER',
					required: true,
					minValue: 1,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const { author } = ctx;
		const user = ctx.options.getUser('user', true);
		const input = ctx.options.getInteger('aposta', true);

		if (user.bot) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:coinflip.bot'),
				ephemeral: true,
			});
			return;
		}

		if (user.id === author.id) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:coinflip.self-mention'),
				ephemeral: true,
			});
			return;
		}

		if (input > ctx.data.author.profile.comets) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:coinflip.poor', { user: author.toString() }),
				ephemeral: true,
			});
			return;
		}

		if (ctx.client.commandExecutions.has(user.id)) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'common:economy_usage'),
				ephemeral: true,
			});
			return;
		}

		const enemyData = await ctx.client.database.user.profiles.findUnique({
			where: {
				id: user.id,
			},
		});

		if (!enemyData) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:coinflip.no-dbuser'),
				ephemeral: true,
			});
			return;
		}

		if (enemyData.ban) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:coinflip.banned-user'),
				ephemeral: true,
			});
			return;
		}

		if (input > enemyData.comets) {
			await ctx.makeMessage({
				content: ctx.prettyResponse('error', 'commands:coinflip.poor', { user: user.toString() }),
				ephemeral: true,
			});
			return;
		}

		ctx.client.commandExecutions.add(user.id);

		const confirmButton = new MessageButton()
			.setCustomId(ctx.interaction.id)
			.setLabel(ctx.locale('commands:coinflip.bet'))
			.setStyle('SUCCESS');

		ctx.makeMessage({
			content: ctx.locale('commands:coinflip.confirm', {
				value: input,
				author: ctx.author.toString(),
				mention: user.toString(),
			}),
			components: [Util.actionRow([confirmButton])],
		});

		const coletor = await Util.collectComponentInteractionWithStartingId(
			ctx.channel,
			user.id,
			ctx.interaction.id,
			7000,
		);

		ctx.client.commandExecutions.delete(user.id);

		if (!coletor) {
			ctx.makeMessage({
				components: [Util.actionRow(Util.disableComponents(ctx.locale('common:timesup'), [confirmButton]))],
			});
			return;
		}

		const options = ['cara', 'coroa'];
		const choice = Util.RandomFromArray(options);

		const winner = choice === 'cara' ? author : user;
		const loser = choice === 'coroa' ? author : user;

		await ctx.makeMessage({
			content: ctx.locale('commands:coinflip.text', {
				choice: ctx.locale(`commands:coinflip.${choice}`),
				value: input,
				winner: winner.toString(),
				loser: loser.toString(),
			}),
			components: [],
		});

		await ctx.client.database.user.addComets(winner.id, input);
		await ctx.client.database.user.removeComets(loser.id, input);

		const date = `${moment().format('DD/MM/YYYY HH:mm')}`;
		const transaction = await ctx.client.database.transactions.create({
			data: {
				reason: 'COINFLIP',
				given_by: loser.id,
				received_by: winner.id,
				quantity: input,
				given_at: date,
			},
		});

		const starTrackerHook = await ctx.client.fetchWebhook(
			process.env.STARTRACKER_ID,
			process.env.STARTRACKER_TOKEN,
		);

		const embed = new MitsyEmbed()
			.setTitle(`<:Mitsy_Rica:872870327049396274> **${input} for COINFLIP**`)
			.addFields(
				{ name: '**💵 Quem pagou**', value: `<@${loser.id}>\n \`\`${loser.username}#${loser.discriminator}\`\``, inline: true },
				{ name: '**💸 Quem recebeu**', value: `<@${winner.id}>\n \`\`${winner.tag}\`\``, inline: true },
			)
			.setFooter({ text: `Transação ${transaction.id}`, iconURL: 'https://cdn.discordapp.com/emojis/873019423827587132.webp' });

		starTrackerHook.send({ embeds: [embed] });
	}
};
