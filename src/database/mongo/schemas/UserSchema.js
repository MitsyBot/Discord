const { Schema } = require('mongoose');

const BlacklistedSchema = new Schema({
	reason: { type: String, required: true },
	blacklister: { type: String, required: true },
});

const UserConnection = new Schema({
	name: String,
	tokens: Object,
	config: Object,
});

const KeySchema = new Schema({
	id: String,
	enabled: Boolean,
	guild: String,
	level: Number,
});

module.exports = new Schema({
	_id: String,
	comets: Number,
	xp: Number,
	level: Number,
	timeDaily: Number,
	blacklist: Boolean,
	aboutme: String,
	profileColor: String,
	isMarry: Boolean,
	marryWith: String,
	repCount: Number,
	repTime: Number,
	repLog: Array,
	shipValue: String,
	background: String,
	profileType: String,
	colorList: Array,
	badgeList: Array,
	badgesEnabled: Array,
	backgroundList: Array,
	profileList: Array,
	isPremium: Boolean,
	premiumLevel: Number,
	isStaff: Boolean,
	staffLevel: Number,
	blacklisted: BlacklistedSchema,
	connections: [UserConnection],
	premium: {
		time: Number,
		tier: Number,
		keys: [KeySchema],
	},
});
