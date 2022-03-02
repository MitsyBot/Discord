const { Controller } = require('../');

module.exports = class ConnectionController extends Controller {
	constructor(client) {
		super({
			name: 'connection',
		}, client);
	}

	get _users() {
		return this.client.database.user;
	}

	async connect(_user, _connection, _tokens) {
		if (typeof _tokens === 'string') _tokens = { token: _tokens };
		if (typeof _tokens !== 'object') throw new TypeError(`ConnectionController.connect deve conter pelo menos um argumento do tipo string ou objeto, ${typeof _tokens} enviados`);
		const user = await this._users.connections.findMany({
			where: {
				id: _user,
			},
		});
		if (user.connections.some(c => c.name === _connection.name)) return 'alreadyConnected';
		const connection = {
			id: _user,
			name: _connection.name,
			tokens: _tokens,
			config: _connection.defaultConfig,
		};
		await this._users.connections.create({
			data: connection,
		});
	}

	async editConfig(_user, _connection, _config) {
		const user = await this._users.connections.findMany({
			where: {
				id: _user,
			},
		});
		const connection = user.connections.find(c => c.name === _connection);
		const connectionChecker = (k, v) => this.client.connections[_connection].checkConfig(k, v);
		let newConfig = Object.entries(_config).filter(c => (connection.config[c[0]] !== undefined && connectionChecker(c)));
		const config = {};
		newConfig.forEach(([key, val]) => {
			config[key] = val;
		});
		newConfig = {
			...connection.config,
			...config,
		};
		await this._users.connections.update({
			where: {
				id: _user,
			},
			data: {
				config: newConfig,
			},
		});
		return newConfig;
	}

	async disconnectUser(_user, _connection) {
		const user = await this._users.connections.findMany({
			where: {
				id: _user,
			},
		});
		const connection = user.connections.find(c => c.name === _connection);
		if (!connection) {
			throw Error('Conexões não encontradas');
		}
		try {
			await this._users.profiles.delete({
				where: {
					id: _user,
				},
			});
			return true;
		}
		catch (e) {
			throw Error('Erro interno de servidor!');
		}
	}

	async getConnections(_user) {
		const connections = this._users.connections.findMany({
			where: {
				id: _user,
			},
		});
		return connections;
	}

	async getConnectionsFiltered(_user) {
		const allConn = await this.allConnectionsDefault;
		const connections = await this.getConnections(_user);
		const userConnections = await Promise.all(allConn.map(async conn => {
			const foundConn = connections.find(c => c.name === conn.name);
			return foundConn
				? {
					name: foundConn.name,
					connected: true,
					account: await this.client.connections[conn.name].getAccountInfo(foundConn.tokens),
					configuration: foundConn.config,
				}
				: conn;
		}));
		return userConnections;
	}

	get allConnectionsDefault() {
		return Object.keys(this.client.connections).map(c => {
			return {
				name: c,
				connected: false,
				account: null,
				configuration: null,
			};
		});
	}
};