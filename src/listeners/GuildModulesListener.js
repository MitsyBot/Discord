const { EventListener } = require('../');

module.exports = class EventLogger extends EventListener {
	constructor(client) {
		super({
			events: ['guildBanAdd', 'guildBanRemove', 'guildMemberUpdate', 'messageUpdate', 'voiceStateUpdate'],
		}, client);
	}

	onGuildBanAdd(ban) {
		const guild = this.database.guild.ensure(ban.guild.id);
		console.log(ban);
		console.log(guild);
	}

	onGuildBanRemove(ban) {
		const guild = this.database.guild.ensure(ban.guild.id);
		console.log(ban);
		console.log(guild);
	}
};