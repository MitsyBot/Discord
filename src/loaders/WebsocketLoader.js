const { Loader, WebSocketController } = require('../');

const express = require('express');
const cors = require('cors');
const url = require('url');
const { Server } = require('ws');

module.exports = class HTTPLoader extends Loader {
	constructor(client) {
		super({}, client);

		this.websocket = null;
	}

	async load() {
		try {
			await this.initializeHTTPServer();
			this.client.websocket = this.app;
			return true;
		}
		catch (e) {
			this.client.logger.error(e);
		}
		return false;
	}

	initializeHTTPServer(port = process.env.SOCKET_PORT) {
		if (!port) return this.client.logger.warn({ tag: 'Websocket' }, 'Você não definiu a porta do websocket nas variaveis de ambiente.');
		if (!this.client.shard.ids.includes(0)) return this.client.logger.info({ tag: 'Websocket' }, 'Servidor não iniciado, o cliente não pode gerenciar a shard 0');

		this.app = express();
		// Use CORS with Express
		this.app.use(cors());
		// Parse JSON body
		this.app.use(express.json());


		const httpServer = this.app.listen(port, () => {
			this.client.logger.info({ tag: 'Websocket' }, `Iniciado na porta ${port}`);
		});
		const ws = new Server({ server: httpServer });

		ws.on('connection', (socket, req) => {
			this.client.logger.info({ tag: 'Websocket' }, 'Nova conexão realizada');
			socket.id = url.parse(req.url, true).query.id ?? 0;
			socket.isAlive = true;
			socket.uptime = Date.now();

			socket.on('message', (rawRequest) => WebSocketController(socket, rawRequest));

			socket.on('pong', (ms) => {
				socket.isAlive = true;
				socket.responseTime = Date.now() - ms.toString();
			});
		});

		setInterval(() => {
			ws.clients.forEach((skt) => {
				if (skt.isAlive === false) return skt.terminate();

				skt.isAlive = false;
				skt.ping(Date.now());
			});
		}, 15000);
	}
};