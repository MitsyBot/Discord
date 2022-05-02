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
		try {
			const data = await apiRequest.get(`/assets/${type}`);
			return data.data.url;
		}
		catch {
			return 'https://http.cat/404';
		}
	}

	static async postShardStatus(shards, client) {
		try {
			await apiRequest.put('/shards', { data: { shards } });
		}
		catch {
			client.logger.error({ tag: 'Shards' }, 'Erro ao enviar status de shards para a api (Provavelmente a api esta desconectada)');
			return true;
		}
	}

	static async shipRequest(
		linkOne,
		linkTwo,
		value,
		percentage,
	) {
		try {
			const data = await axios({
				url: `${process.env.GENERATOR_URL}/render/ship`,
				method: 'post',
				data: { linkOne, linkTwo, value, percentage },
				responseType: 'arraybuffer',
			});

			return { err: false, data: data.data };
		}
		catch {
			return { err: true };
		}
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


	static async postCommandStatus(commands, client) {
		try {
			await apiRequest.post('/commands', { data: { commands } }).catch();
		}
		catch {
			client.logger.error({ tag: 'Comandos' }, 'Erro ao enviar comandos para a api (Provavelmente a api esta desconectada)');
			return true;
		}
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