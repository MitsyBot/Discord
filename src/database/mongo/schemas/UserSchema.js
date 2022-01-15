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

module.exports = new Schema({
	_id: String,
	id: { type: String, index: { unique: true } },
	comets: { type: Number, default: 0, index: true },
	xp: { type: Number, default: 0, index: true },
	level: { type: Number, default: 1, index: true },
	timeDaily: { type: Number, default: 0 },
	afk: { type: Boolean, default: false, index: true },
	afkReason: { type: String, default: null },
	blacklist: { type: Boolean, default: false, index: true },
	aboutme: { type: String, default: 'default' },
	profileColor: { type: String, default: '#ec4ce8' },
	isMarry: { type: Boolean, default: false },
	marryWith: { type: String, default: '' },
	repCount: { type: Number, default: 0 },
	repTime: { type: Number, default: 0 },
	repLog: { type: Array, default: [] },
	shipValue: { type: String, default: null },
	background: { type: String, default: 'mitsy_1' },
	profileType: { type: String, default: 'default' },
	backgroundList: { type: Array, default: ['mitsy_1'] },
	profileList: { type: Array, default: ['default'] },
	isPremium: { type: Boolean, default: false },
	premiumLevel: { type: Number, default: 0 },
	isStaff: { type: Boolean, default: false },
	staffLevel: { type: Number, default: 0 },
	blacklisted: BlacklistedSchema,
	connections: [UserConnection],
});
