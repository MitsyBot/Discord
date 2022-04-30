const { EventListener } = require('../../');
module.exports = class AutoroleListener extends EventListener {
	constructor(client) {
		super({
			events: [ 'guildMemberAdd'],
		}, client);
	}

	async onGuildMemberAdd(member) {
		const guild = await this.database.guild.ensure(member.guild.id);
		if (guild.autorole.give_after_message) return;

		if (guild.autorole.enabled) {
			for (const role of guild.autorole.roles) {
				if (guild.autorole.give_after > 1) {
					const guild_role = member.guild.roles.cache.get(role);
					setTimeout(() => {
						member.roles.add(guild_role);
					}, guild.autorole.give_after * 1000);
				}
				else {
					const guild_role = member.guild.roles.cache.get(role);
					if (role) {
						member.roles.add(guild_role);
					}
				}
			}

		}
	}
};