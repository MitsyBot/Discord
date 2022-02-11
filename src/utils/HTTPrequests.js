const axios = require('axios');


const image = axios.create({
	baseURL: `${process.env.GENERATOR_URL}`,
	timeout: 5000,
	responseType: 'arraybuffer',
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
			return data.url;
		}
		catch {
			return 'https://http.cat/404';
		}
	}

	static async postShardStatus(shards) {
		await apiRequest.put('/shards', { data: { shards } });
	}

	static async getMitsyApiPing() {
		try {
			const data = await apiRequest.get('/ping');
			return data.data;
		}
		catch {
			return 'https://http.cat/404';
		}
	}


	static async postCommandStatus(commands) {
		await apiRequest.post('/commands', { data: { commands } });
	}

	static async profileRequest(_data) {
		try {
			const data = await image.post('/render/profile', {
				data: _data,
			});
			console.log(_data);

			return { err: false, data: data.data };
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