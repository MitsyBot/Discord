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
			premiumLevel: 0,
			backgroundList: ['mitsy_1'],
			background: 'mitsy_1',
			level: 1,
			blacklist: false,
			isMarry: false,
			marryWith: null,
			repLog: {},
			shipValue: null,
			xp: 0,
			colorList: [
				'#f895fb',
			],
			profileType: 'default',
			badgeList: [],
			badgesEnabled: [],
			profileList: [],
			isStaff: false,
			staffLevel: 0,
			blacklisted: {},
			premium: {
				time: 0,
				tier: 0,
				keys: [],
			},			profileColor: '#f895fb',
			aboutme: 'Mitsy é minha melhor amiga, Você pode mudar esse texto no seu perfil do meu website.',
			connections: [],
			...(super.parse(entity) || {}),
		};
	}
};