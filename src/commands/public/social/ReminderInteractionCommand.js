/* eslint-disable no-mixed-spaces-and-tabs */
const { InteractionCommand, MitsyEmbed } = require('../../../');
const moment = require('moment');
module.exports = class LevelInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'lembrete',
			description: 'Agende um lembrete na mitsy, e eu irei te lembrar no tempo definido.',
			category: 'social',
			options: [
				{
					name: 'criar',
					description: 'Crie um lembrete',
					type: 'SUB_COMMAND',
					usage: '/lembrete criar 1 minuto Levar o jeremias para passear',
					options: [
						{
							name: 'tempo',
							type: 'NUMBER',
							usage: '/lembrete 10 minutos',
							description: 'Escreva o numero do tempo',
							required: true,
						},
						{
							name: 'tipo',
							description: 'O tipo de horario (minutos, segundos, etc)',
							type: 'STRING',
							required: true,
							choices: [
								{
									name: 'Meses',
									value: 'months',
								},
								{
									name: 'Dias',
									value: 'days',
								},
								{
									name: 'Horas',
									value: 'hours',
								},
								{
									name: 'Minutos',
									value: 'minutes',
								},
								{
									name: 'Segundos',
									value: 'seconds',
								},
							],
						},
						{
							name: 'motivo',
							type: 'STRING',
							usage: '/lembrete 10 minutos levar o jeremias para passear',
							description: 'Escreva o motivo do lembrete (opcional)',
							required: false,
						},
					],
				},
				{
					name: 'listar',
					description: 'Liste todos os seus lembretes',
					type: 'SUB_COMMAND',
					usage: '/lembrete listar',
					options: [
						{
							name: 'pagina',
							type: 'NUMBER',
							usage: '/lembrete listar 10',
							description: 'Escolha uma pagina para listar os lembretes',
							required: false,
						},
						{
							name: 'id',
							type: 'NUMBER',
							usage: '/lembrete listar 1',
							description: 'Veja mais informações sobre um lembrete',
							required: false,
						},
					],
				},
				{
					name: 'remover',
					description: 'Remova um lembrete especifico',
					type: 'SUB_COMMAND',
					usage: '/lembrete remover 1',
					options: [
						{
							name: 'id',
							type: 'NUMBER',
							usage: '/lembrete remover 1',
							description: 'Id do lembrete que quer remover',
							required: true,
						},
					],
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const type = ctx.options.getSubcommand();

		if (!type) return this.create(ctx);
		if (type === 'criar') return this.create(ctx);
		if (type === 'listar') return this.list(ctx);
		if (type === 'remover') return this.remove(ctx);
	}

	async create(ctx) {
		const author = ctx.author;
		const type = ctx.options.getString('tipo');
		const time = ctx.options.getNumber('tempo');
		const reason = (ctx.options.getString('motivo')) || 'Nenhum motivo';
		let duration;
		switch (type) {
		case 'months': duration = time * 1000 * 60 * 60 * 24 * 30; break;
		case 'days': duration = time * 1000 * 60 * 60 * 24; break;
		case 'hours': duration = time * 1000 * 60 * 60; break;
		case 'seconds': duration = time * 1000; break;
		case 'minutes': duration = time * 1000 * 60; break;
		}
		duration = Date.now() + duration;
		const date = `${moment(duration).format('**DD/MM/YYYY** à[s] **HH:mm**')}`;
		await ctx.client.reminders.add(duration, author, ctx.interaction.channel, ctx.interaction.guild, reason);
		ctx.makeMessage({ content: ctx.prettyResponse('MITSY_OK', 'commands:remind.created', { reason, date }) });
	}

	async list(ctx) {
		if (!ctx.options.getNumber('id')) {
			const page = ctx.options.getNumber('pagina');
			let skip = (1 * 10) * (page - 1);
			let takeNumber = page * 10;
			if (!page) {
				skip = 0;
				takeNumber = 10;
			}

			console.log(skip);
			console.log(takeNumber);

			const reminders = await ctx.client.database.reminders.findMany({
				skip,
				take: takeNumber,
				where: {
					user: ctx.author.id,
				},
			});
			const embed = new MitsyEmbed()
		 .setTitle('Lembretes');

			for (const reminder of reminders) {
				embed.addField(`**[${reminder.id}]** \`\`${reminder.content}\`\``, `${moment(reminder.duration).format('**DD/MM/YYYY** à[s] **HH:mm**')}`);
			}

			ctx.makeMessage({ content: ctx.prettyResponse('MITSY_OK', 'commands:remind.list', { page, length: reminders.length }), embeds: [embed] });

		}

		if (ctx.options.getNumber('id')) {
			const reminder = await ctx.client.database.reminders.findUnique({
				where: {
					id: ctx.options.getNumber('id'),
				},
			});
			if (!reminder) return ctx.makeMessage({ content: 'Não encontrei esse lembrete' });
			const guild = ctx.client.guilds.cache.get(reminder.guild_id);
			const embed = new MitsyEmbed()
				.setTitle(`Lembrete ${reminder.id}`)
				.addField('Motivo', reminder.content)
				.addField('Servidor', guild.name)
				.addField('Canal', `<#${guild.channels.cache.get(reminder.channel_id).id}>`)
				.addField('Data', moment(reminder.duration).format('**DD/MM/YYYY** à[s] **HH:mm**'));
			return ctx.makeMessage({ content: `**ID: ${reminder.id}**`, embeds: [embed] });
		}
	}

	async remove(ctx) {
		const id = ctx.options.getNumber('id');
		const remind = await ctx.client.reminders.remove(id);
		ctx.makeMessage({ content: ctx.prettyResponse('MITSY_OK', 'commands:remind.deleted', { id, content: remind.content }) });
	}
};