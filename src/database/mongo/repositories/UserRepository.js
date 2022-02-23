const MongoRepository = require('../MongoRepository.js');
const UserSchema = require('../schemas/UserSchema.js');

module.exports = class UserRepository extends MongoRepository {
	constructor(mongoose) {
		super(mongoose, mongoose.model('User', UserSchema));
	}

	parse() {
		return {
			comets: 0,
			xp: 0,
			level: 0,
			timeDaily: 0,
			blacklist: false,
			aboutme: 'Mitsy é minha melhor amiga - Você pode alterar isto no meu website',
			profileColor: '#f895fb',
			isMarry: false,
			marryWith: '',
			repCount: 0,
			repTime: 0,
			repLog: [],
			shipValue: '',
			background: '',
			profileType: 'default',
			colorList: [ '#f895fb' ],
			badgeList: [],
			badgesEnabled: [],
			backgroundList: [ 'mitsy_1' ],
			profileList: [ 'default' ],
			isPremium: false,
			premiumLevel: 0,
			isStaff: false,
			staffLevel: 0,
			blacklisted: {},
			connections: [],
			premium: {
				time: 0,
				tier: 0,
				keys: [],
			},
		};
	}
};