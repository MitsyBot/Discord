const moment = require('moment');
const Intl = require('intl');
Intl.__disableRegExpRestore();

module.exports = class MiscUtils {
	static findArrayDuplicates(arr) {
		return arr.filter((value, index) => {
			return arr.indexOf(value) !== index;
		});
	}

	static formatNumber(value, language) {
		const formatter = new Intl.NumberFormat(language);
		return formatter.format(value);
	}

	static disableComponents(label, components) {
		components.map((c) => {
			c.setDisabled(true);
			c.setLabel(label);
			return c;
		});
	}

	static async collectComponentInteractionWithStartingId(
		channel,
		authorID,
		customId,
		time = 20000,
	) {
		return channel
			.awaitMessageComponent({
				filter: (m) => {
					m.deferUpdate().catch(() => null);
					return m.user.id === authorID && m.customId.startsWith(customId);
				},
				time,
			})
			.then((interaction) => interaction)
			.catch(() => null);
	}


	static resolveCustomId(customId) {
		return customId
			.replace(/^[\s\d]+/, '')
			.replace('|', '')
			.trim();
	}

	static formatDuration(duration) {
		return moment.duration(duration).format('hh:mm:ss', { stopTrim: 'm' });
	}

	static capitalizeFirstLetter(string, everyWord = false) {
		const capitalizeWord = w => w.charAt(0).toUpperCase() + w.slice(1);
		if (everyWord) return string.split(' ').map(capitalizeWord).join(' ');
		return capitalizeWord(string);
	}
};