const { EventListener, MiscUtils } = require('../');

module.exports = class MessageListener extends EventListener {
	constructor(client) {
		super({
			events: ['guildMemberUpdate'],
		}, client);
	}

	async onGuildMemberUpdate(_oldMember, newMember) {
		if (newMember.id === this.client.user.id) {
			const botName = newMember.displayName;
			const HasBadNickname = MiscUtils.hasInappropriateWords(botName);
			if (HasBadNickname) {
				newMember.setNickname('Mitsy', 'Mitsy tinha um nome muito feio #chateada');
			}
		}
	}
};