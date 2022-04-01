const { EventListener } = require('../');

module.exports = class EventLogger extends EventListener {
	constructor(client) {
		super({
			events: ['guildBanAdd', 'guildBanRemove', 'guildMemberUpdate', 'messageUpdate', 'voiceStateUpdate'],
		}, client);
	}

	async onGuildBanAdd(ban) {
		const guild = await this.database.guild.ensure(ban.guild.id);
		console.log(ban);
		console.log(guild);
	}

	async onGuildBanRemove(ban) {
		const guild = await this.database.guild.ensure(ban.guild.id);
		console.log(ban);
		console.log(guild);
	}
};