const { InteractionCommand, MitsyEmbed } = require('../../../');

module.exports = class LevelInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'cargo',
			description: 'Veja informações de um cargo do servidor.',
			category: 'util',
			options: [
				{
					name: 'cargo',
					type: 'ROLE',
					usage: '/cargo #ADMININASTRO',
					description: 'Mencione um cargo',
					required: true,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const role = ctx.options.getRole('cargo');
		if (!role) return ctx.makeMessage({ content: ctx.prettyResponse('MITSY_STOP', 'commands:roleinfo.roleNotExist') });

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:roleinfo.roleName', { 0: role.name }))
			.addField(ctx.locale('commands:roleinfo.roleMention'), `@${role.name}`, true)
			.addField(ctx.locale('commands:roleinfo.roleID'), role.id, true)
			.addField(ctx.locale('commands:roleinfo.roleColor'), `#${role.color.toString(16).toUpperCase()}`, true)
			.addField(ctx.locale('commands:roleinfo.roleGuild'), `\`${role.guild.name}\``, true)
			.addField(ctx.locale('commands:roleinfo.roleHoist'), ctx.locale(`common:${role.hoist}`), true)
			.addField(ctx.locale('commands:roleinfo.roleMentionable'), ctx.locale(`common:${role.mentionable}`), true)
			.addField(ctx.locale('commands:roleinfo.roleManaged'), ctx.locale(`common:${role.managed}`), true)
			.addField(ctx.locale('commands:roleinfo.roleCreatedAt'), `<t:${parseInt(role.createdAt / 1000).toFixed(0)}:F>`, true);

		ctx.makeMessage({ embeds: [embed] });
	}
};