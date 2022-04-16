const { Server, ServerCredentials, loadPackageDefinition } = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const GuildService = require('./services/Guild');
const server = new Server({
	'grpc.max_receive_message_length': -1,
	'grpc.max_send_message_length': -1,
});
const options = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
};


module.exports = class GrpcServer {
	static async startGRPCServer(client) {
		const packageDefinition = protoLoader.loadSync('./protos/discord.proto', options);
		const discordProto = loadPackageDefinition(packageDefinition);

		server.addService(discordProto.GuildService.service, new GuildService(client));
		server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), (err, bindPort) => {
			if (err) {
				throw err;
			}

			client.logger.info({ tag: 'gRPC' }, `Servidor iniciado na porta ${bindPort}`);
			server.start();
		});
	}
};
