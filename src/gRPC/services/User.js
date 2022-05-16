module.exports = class UserService {
	constructor(client) {
		this.client = client;
	}
	async send(call, callback) {
		const { id, message } = call.request;
		console.log(id);
		console.log(message);
		console.log(this.client);
		callback(null, { sucess: true });


		/* try {
			const user = await this.client.users.fetch(id);
			user.send(message).catch(() => { this.client.logger.error(`Could not send message to ${user.tag}`); });
		}
		catch (err) {
			this.client.logger.error(err);
			callback(null, { sucess: false });
		} */

	}
};