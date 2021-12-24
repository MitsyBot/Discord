const axios = require('axios');


const request = axios.create({
	baseURL: `${process.env.API_URL}/imageserver`,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		'User-Agent': process.env.MITSY_AGENT,
		Authorization: process.env.API_TOKEN,
	},
});

const apiRequest = axios.create({
	baseURL: `${process.env.API_URL}`,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		'User-Agent': process.env.MITSY_AGENT,
		Authorization: process.env.API_TOKEN,
	},
});

module.exports = class HttpRequests {

	static async getAssetImageUrl(type) {
		try {
			const data = await apiRequest.get(`/assets/${type}`);
			return data.data.url;
		}
		catch {
			return 'https://http.cat/404';
		}
	}


	static async postCommandStatus(commands) {
		await apiRequest.post('/commands', { data: { commands } });
	}

	static async profileRequest(user, marry) {
		try {
			const data = await request.get('/profile', {
				data: {
					user,
					marry,
				},
			});
			return { err: false, data: Buffer.from(data.data) };
		}
		catch {
			return { err: true };
		}
	}

	static async getActivity(shard) {
		try {
			const data = await apiRequest.get('/activity', { data: { shard: shard || 0 } });
			return data.data;
		}
		catch {
			return { name: `❤️ | Howdy | Shard ${shard}`, type: 'PLAYING' };
		}
	}
};