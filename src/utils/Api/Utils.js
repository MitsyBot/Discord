const { Permissions } = require('discord.js');
const { flattenChannel, flattenRole } = require('./FlattenChannels');
module.exports = class ApiUtils {
	static async canManage(guild, member) {
		if (guild.ownerId === member.id) return true;
		if (member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return true;
	}

	static flattenGuild(guild) {
		return {
			afkChannelId: guild.afkChannelId,
			afkTimeout: guild.afkTimeout,
			applicationId: guild.applicationId,
			approximateMemberCount: guild.approximateMemberCount,
			approximatePresenceCount: guild.approximatePresenceCount,
			available: guild.available,
			banner: guild.banner,
			channels: guild.channels.cache.map(flattenChannel),
			defaultMessageNotifications: guild.defaultMessageNotifications,
			description: guild.description,
			widgetEnabled: guild.widgetEnabled,
			explicitContentFilter: guild.explicitContentFilter,
			features: guild.features,
			icon: guild.icon,
			id: guild.id,
			joinedTimestamp: guild.joinedTimestamp,
			mfaLevel: guild.mfaLevel,
			name: guild.name,
			ownerId: guild.ownerId,
			partnered: guild.partnered,
			preferredLocale: guild.preferredLocale,
			premiumSubscriptionCount: guild.premiumSubscriptionCount,
			premiumTier: guild.premiumTier,
			roles: guild.roles.cache.map(flattenRole),
			splash: guild.splash,
			systemChannelId: guild.systemChannelId,
			vanityURLCode: guild.vanityURLCode,
			verificationLevel: guild.verificationLevel,
			verified: guild.verified,
		};
	}
};