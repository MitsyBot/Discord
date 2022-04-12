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

	static hasInappropriateWords(string) {
		const BAD_NICKNAMES = [
			'puta',
			'vagabunda',
			'lixo',
			'desgraça',
			'burra',
			'piranha',
			'protistuta',
			'bicha',
			'bixa',
			'arromabada',
			'cachorra',
			'ruim',
			'boquete',
			'boqueteira',
			'putona',
			'viada',
			'vadia',
			'putiane',
			'fdp',
			'xereca',
			'pepeca',
			'pepeka',
			'ppk',
			'escrava sexual',
			'xota',
			'xoxota',
			'xoxotinha',
		];

		const lowerCaseNickname = string.toLowerCase()
			.replace('4', 'a')
			.replace('@', 'a')
			.replace('1', 'i')
			.replace('0', 'o');

		return BAD_NICKNAMES.includes(lowerCaseNickname);
	}

	static resolveCustomId(customId) {
		return customId
			.replace(/^[\s\d]+/, '')
			.replace('|', '')
			.trim();
	}

	static replacePlaceholders(template, values) {
		if (!values.length) {return template;}

		for (const [ index, value ] of values.entries()) {

			switch (typeof value) {
			case 'object':
				for (const [ i, v ] of Object.entries(value)) {
					const regex = new RegExp(`(?<!\\\\)\\{${i}\\}`, 'gi');
					template = template.replace(regex, v);
				}

				break;
			case 'string':
				// eslint-disable-next-line no-case-declarations
				const regex = new RegExp(`(?<!\\\\)\\{${index}\\}`, 'gi');
				template = template.replace(regex, value);
			}

		}

		return template;
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