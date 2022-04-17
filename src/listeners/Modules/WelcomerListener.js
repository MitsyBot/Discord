const { EventListener, MiscUtils } = require('../../');

module.exports = class MessageListener extends EventListener {
	constructor(client) {
		super({
			events: ['guildMemberAdd', 'guildMemberRemove'],
		}, client);
	}

	async onGuildMemberAdd(member) {
		console.log('alo?');
		const guild = await this.database.guild.ensure(member.guild.id);
		if (guild.welcomer.enabled) {

			if (guild.welcomer.tell_on_join) {
				const channel = await member.guild.channels.cache.get(guild.welcomer.channel_join);

				const messageToSend = guild.welcomer.join_message;
				console.log(JSON.stringify(messageToSend));
				const values = [
					{
						User: member.user.username,
						'@User':  `<@${member.user.id}>`,
					},
				];
				const jsonmess = MiscUtils.replacePlaceholders(JSON.stringify(messageToSend), values);
				const message = channel.send(JSON.parse(jsonmess));

				if (guild.welcomer.delete_join_messages_after > 0) {
					message;
					setTimeout(() => {
						message.delete();
					}, guild.welcomer.delete_join_messages_after * 1000);
				}
				else {
					message;
				}
			}

			if (guild.welcomer.tell_on_private_join) {
				const values = [
					{
						User: member.user.username,
						'@User':  `<@${member.user.id}>`,
					},
				];
				const jsonmess = MiscUtils.replacePlaceholders(JSON.stringify(guild.welcomer.join_private_message), values);
				member.user.send(JSON.parse(jsonmess));
			}
		}

	}

	async onGuildMemberRemove(member) {
		const guild = await this.database.guild.ensure(member.guild.id);
		if (guild.welcomer.enabled && guild.welcomer.tell_on_remove) {
			const channel = await member.guild.channels.cache.get(guild.welcomer.channel_remove);

			const messageToSend = guild.welcomer.remove_message;
			const values = [
				{					User: member.user.username,
					'@User':  `<@${member.user.id}>`,
				},
			];
			console.log(JSON.stringify(messageToSend));
			const jsonmess = MiscUtils.replacePlaceholders(JSON.stringify(messageToSend), values);
			const message = channel.send(JSON.parse(jsonmess));

			if (guild.welcomer.delete_remove_messages_after > 0) {
				message;
				setTimeout(() => {
					message.delete();
				}, guild.welcomer.delete_remove_messages_after * 1000);
			}
			else {
				message;
			}
		}
	}
};