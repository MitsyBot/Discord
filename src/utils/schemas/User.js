const mongoose = require('mongoose');

const Users = new mongoose.Schema({
	id: { type: String, index: { unique: true } },
	comets: { type: Number, default: 0, index: true },
	xp: { type: Number, default: 0, index: true },
	level: { type: Number, default: 1, index: true },
	timeDaily: { type: Number, default: 0 },
	afk: { type: Boolean, default: false, index: true },
	afkReason: { type: String, default: null },
	blacklist: { type: Boolean, default: false, index: true },
	blacklistReason: { type: String, default: null },
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
});

module.exports = mongoose.model('Users', Users);
