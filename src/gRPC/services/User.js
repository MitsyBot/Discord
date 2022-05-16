module.exports = class UserService {
	constructor(client) {
		this.client = client;
	}
	async send(call, callback) {
		try {
			const { id, message } = call.request;
			console.log(id);
			console.log(message);
			const user = await this.client.users.fetch(id);
			user.send(message).catch(() => { this.client.logger.error(`Could not send message to ${user.tag}`); });
			callback(null, { sucess: true });

		}
		catch (err) {
			this.client.logger.error(err);
			callback(null, { sucess: false });
		}

	}
};