const { InteractionCommand } = require('../../');
module.exports = class MaintenanceDevInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'manutenção',
			description: 'Nada aqui',
			options: [
				{
					name: 'hora',
					type: 'STRING',
					description: 'Hora de inicio da manutenção',
					required: false,
				},
				{
					name: 'opções',
					type: 'STRING',
					description: 'Escolha uma dessas opções',
					required: false,
					choices: [
						{
							name: 'desativar',
							value: 'desativar',
						},
					],
				},
			],
			category: 'special',
			devsOnly: true,
		});
	}

	async run(ctx) {
		ctx.makeMessage({ content: '...' });
		if (ctx.interaction.options.getString('opções') === 'desativar') {
			ctx.client.maintenance.enabled = false;
			ctx.makeMessage({ content: 'Manutenção desativada' });
			return;
		}

		if (ctx.interaction.options.getString('hora')) {
			ctx.client.maintenance.enabled = true;
			ctx.client.maintenance.time = ctx.interaction.options.getString('hora');
			ctx.makeMessage({ content: `Manutenção ativada para ${ctx.client.maintenance.time}` });
			ctx.client.user.setActivity({ name: `Manutenção programada: Hoje as ${ctx.client.maintenance.time} eu irei reiniciar para aplicar updates`, type: 'PLAYING' });
		}
	}
};
