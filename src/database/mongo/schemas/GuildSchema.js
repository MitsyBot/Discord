const { Schema } = require('mongoose');

const ModuleSchema = new Schema({
	active: { type: Boolean, required: true },
	values: {},
});

module.exports = new Schema({
	_id: String,
	id: String,
	prefix: String,
	lang: String,
	modules: {
		type: Map,
		of: ModuleSchema,
	},
	partner: Boolean,
	logChannel: String,
	customCommands: Array,
	blacklist: Boolean,
	blacklistReason: String,
	blacklistedChannels: Object,
	isPremium: Boolean,
	premiumLevel: Number,
});