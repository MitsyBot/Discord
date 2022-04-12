const axios = require('axios');

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
		const data = await apiRequest.get(`/assets/${type}`);
		console.log(data);
		return data.url;
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
			const data = await axios({
				url: `${process.env.GENERATOR_URL}/render/profile?w=600&h=400&type=thumb`,
				method: 'post',
				data: _data,
				responseType: 'arraybuffer',
			});

			return { err: false, data: data.data };
		}
		catch {
			return { err: true };
		}
	}

	static async avatarsLogRequest(_data) {
		try {
			const data = await axios({
				url: `${process.env.GENERATOR_URL}/render/avatars`,
				method: 'post',
				data: _data,
				responseType: 'arraybuffer',
			});

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

	static async getFanarts(shard) {
		try {
			const data = await apiRequest.get('/fanarts/activity', { data: { shard: shard || 0 } });
			return data.data;
		}
		catch {
			return { avatar: 'https://imgur.com/yZVrWCl.png', activity: { name: `❤️ | Howdy | Shard ${shard}`, type: 'PLAYING' } };
		}
	}
};