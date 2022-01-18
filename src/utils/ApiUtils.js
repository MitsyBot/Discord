const { Permissions } = require('discord.js');
module.exports = function canManage(guild, member) {
	if (guild.ownerId === member.id) return true;

	if (member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return true;
};
