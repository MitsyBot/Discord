const { EventListener, MiscUtils } = require('../../');

module.exports = class MessageListener extends EventListener {
	constructor(client) {
		super({
			events: ['messageCreate'],
		}, client);
	}

	async onMessageCreate(message) {
		const isInvite = (/((?:discord\.gg|discordapp\.com\/invite|discord\.com\/invite))/g).test(message.content);
		if (message.content.length === 0) return null;
		const guild = await this.database.guild.ensure(message.guild.id);
		if (guild.invite_blocker.enabled && isInvite) {
			const channels = guild.invite_blocker.whitelisted_channels;
			const invite = await message.client.invites.fetch(message.content);
			console.log(invite);
			if (!channels.includes(message.channel.id)) {
				if (guild.invite_blocker.delete_message) {
					message.delete();
				}

				if (guild.invite_blocker.tell_user) {
					const replyMessage = guild.invite_blocker.warn_message;
					message.channel.send(MiscUtils.replacePlaceholders(replyMessage, message));
				}

			}
		}
	}
};