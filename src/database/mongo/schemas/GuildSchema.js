const { Schema } = require('mongoose');

const ModuleSchema = new Schema({
	active: { type: Boolean, required: true },
	values: {},
});

module.exports = new Schema({
	_id: String,
	id: { type: String, index: { unique: true } },
	prefix: { type: String, default: process.env.BOT_PREFIX },
	lang: { type: String, default: 'pt-BR' },
	modules: {
		type: Map,
		of: ModuleSchema,
	},
	partner: { type: Boolean, default: false },
	logChannel: { type: String, default: '' },
	customCommands: { type: Array },
	blacklist: { type: Boolean, default: false },
	blacklistReason: { type: String, default: '' },
	blacklistedChannels: { type: Object, default: { channels: [], warn: false }	},
	isPremium: { type: Boolean, default: false },
	premiumLevel: { type: Number, default: 0 },
});