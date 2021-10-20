const userSchema = require('./schemas/User');
const guildSchema = require('./schemas/Guild');

module.exports.fetchUser = async function(key) {
	let member = await userSchema.findOne({ id: key });

	if (member) {
		return member;
	}

	else {
		member = new userSchema({
			id: key,
		});

		await member.save();
		return member;
	}
};

module.exports.fetchGuild = async function(key) {
	let guild = await guildSchema.findOne({ id: key });

	if (guild) {
		return guild;
	}

	else {
		guild = new guildSchema({
			id: key,
		});

		await guild.save();
		return guild;
	}
};