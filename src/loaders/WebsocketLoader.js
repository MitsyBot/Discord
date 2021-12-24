const { Loader, WebSocketController } = require('../');
const WebSocket = require('ws');
module.exports = class HTTPLoader extends Loader {
	constructor(client) {
		super({}, client);

		this.ws = null;
	}

	async load() {
		try {
			await this.initializeHTTPServer();
			this.client.ws = this.ws;
			return true;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}

	initializeHTTPServer(ws_url = process.env.API_URL) {
		if (!ws_url) return this.client.logger.warn({ tag: 'Websocket' }, 'Você não inseriu a url do websocket da api.');
		if (!this.client.shard.ids.includes(0)) return this.client.logger.info({ tag: 'Websocket' }, 'Servidor não iniciado, o cliente não pode gerenciar a shard 0');

		this.connect();
	}

	connect() {
		try {
			this.ws = new WebSocket(process.env.API_URL);
			this.prepareListeners();
			this.client.logger.info({ tag: 'Websocket' }, 'Cliente esta tentando se conectar ao servidor.');
		}
		catch (err) {
			if (err instanceof Error) this.client.logger.error({ tag: 'Websocket' }, `Ocorreu um erro ao se conectar ao servidor: ${err.message}`);
			this.ws = null;

			this.isAlive = false;
		}
	}

	heartbeat(data) {
		this.ruuningError = false;
		if (typeof this.pingTimeout !== 'undefined') clearTimeout(this.pingTimeout);

		this.isAlive = true;
		if (data) this.ws.pong(data);

		this.pingTimeout = setTimeout(
			(manager) => {
				if (manager && manager.readyState === manager.OPEN) manager.terminate();
			},
			20000,
			this.ws,
		);
	}

	onError(err) {
		this.ruuningError = true;
		this.isAlive = false;
		if (this.retries >= 5) {
			this.client.logger.info({ tag: 'Websocket' }, 'Cliente não vai mais tentar se conectar ao servidor');
			if (this.ws) this.ws.removeAllListeners();
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
		if (this.ws) this.ws.terminate();
		if (this.pingTimeout) clearTimeout(this.pingTimeout);

		setTimeout(() => {
			this.connect();
		}, 5000);
	}

	prepareListeners() {
		if (!this.ws) return;

		this.ws
			.on('open', () => {
				this.client.logger.info({ tag: 'Websocket' }, 'Cliente foi conectado ao servidor');
				this.retries = 0;
				this.heartbeat();
			})
			.on('message', (rawRequest) => WebSocketController(this.ws, rawRequest))
			.on('close', () => this.onClose())
			.on('error', (err) => this.onError(err))
			.on('ping', (data) => this.heartbeat(data));
	}

};