const { EventListener } = require('../../');
module.exports = class AutoroleListener extends EventListener {
	constructor(client) {
		super({
			events: [ 'guildMemberAdd'],
		}, client);
	}

	async onGuildMemberAdd(member) {
		console.log('novo membro');
	}
};