const { Loader, WebSocketController } = require('../');
const WebSocket = require('ws');
module.exports = class HTTPLoader extends Loader {
	constructor(client) {
		super({}, client);

		this.api = null;
	}

	async load() {
		try {
			await this.initializeHTTPServer();
			this.client.api.ws = this.api;
			return true;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}

	initializeHTTPServer(ws_url = process.env.API_WEBSOCKET) {
		if (!ws_url) return this.client.logger.warn({ tag: 'Websocket' }, 'Você não inseriu a url do websocket da api.');
		if (!this.client.shard.ids.includes(0)) return this.client.logger.info({ tag: 'Websocket' }, 'Servidor não iniciado, o cliente não pode gerenciar a shard 0');

		this.connect();
	}

	connect() {
		try {
			this.api = new WebSocket(process.env.API_WEBSOCKET);
			this.prepareListeners();
			this.client.logger.info({ tag: 'Websocket' }, 'Cliente esta tentando se conectar ao servidor.');
		}
		catch (err) {
			if (err instanceof Error) this.client.logger.error({ tag: 'Websocket' }, `Ocorreu um erro ao se conectar ao servidor: ${err.message}`);
			this.api = null;

			this.isAlive = false;
		}
	}

	heartbeat(data) {
		this.ruuningError = false;
		if (typeof this.pingTimeout !== 'undefined') clearTimeout(this.pingTimeout);

		this.isAlive = true;
		if (data) this.api.pong(data);

		this.pingTimeout = setTimeout(
			(manager) => {
				if (manager && manager.readyState === manager.OPEN) manager.terminate();
			},
			20000,
			this.api,
		);
	}

	onError(err) {
		this.ruuningError = true;
		this.isAlive = false;
		if (this.retries >= 5) {
			this.client.logger.info({ tag: 'Websocket' }, 'Cliente não vai mais tentar se conectar ao servidor');
			if (this.api) this.api.removeAllListeners();
			return;
		}

		this.client.logger.info({ tag: 'Websocket' }, `Erro: ${err.message}`);
		if (this.pingTimeout) clearTimeout(this.pingTimeout);

		setTimeout(() => {
			this.retries += 1;
			this.connect();
		}, 15000);
	}

	onClose() {
		this.isAlive = false;
		this.client.logger.info({ tag: 'Websocket' }, 'A conexão com o servidor foi fechada');
		if (this.ruuningError) return;
		if (this.api) this.api.terminate();
		if (this.pingTimeout) clearTimeout(this.pingTimeout);

		setTimeout(() => {
			this.connect();
		}, 5000);
	}

	prepareListeners() {
		if (!this.api) return;

		this.api
			.on('open', () => {
				this.client.logger.info({ tag: 'Websocket' }, 'Cliente foi conectado ao servidor');
				this.retries = 0;
				this.heartbeat();
			})
			.on('message', (rawRequest) => WebSocketController(this.api, rawRequest))
			.on('close', () => this.onClose())
			.on('error', (err) => this.onError(err))
			.on('ping', (data) => this.heartbeat(data));
	}

};