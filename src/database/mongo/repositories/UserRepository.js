const MongoRepository = require('../MongoRepository.js');
const UserSchema = require('../schemas/UserSchema.js');

module.exports = class UserRepository extends MongoRepository {
	constructor(mongoose) {
		super(mongoose, mongoose.model('User', UserSchema));
	}

	parse(entity) {
		return {
			comets: 0,
			timeDaily: 0,
			repCount: 0,
			repTime: 0,
			isPremium: false,
			backgroundList: ['mitsy_1'],
			background: 'mitsy_1',
			level: 1,
			xp: 0,
			aboutme: 'Mitsy é incrivel demais, Você pode mudar esse texto no seu perfil do meu website.',
			connections: [],
			...(super.parse(entity) || {}),
		};
	}
};