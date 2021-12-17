const { Loader, FileUtils } = require('../');

const i18next = require('i18next');
const translationBackend = require('i18next-node-fs-backend');

module.exports = class LocaleLoader extends Loader {
	constructor(client) {
		super({}, client);

		this.cldr = { languages: {} };
	}

	async load() {
		try {
			await this.downloadAndInitializeLocales();
			this.client.i18next = i18next;
			this.client.cldr = this.cldr;
			return true;
		}
		catch (e) {
			console.error(e);
		}
		return false;
	}

	async downloadAndInitializeLocales(dirPath = 'src/locales') {
		const dir = await FileUtils.readdir(dirPath);

		return new Promise((resolve) => {
			try {
				i18next.use(translationBackend).init({
					ns: ['commands', 'common', 'errors'],
					preload: dir,
					fallbackLng: 'pt-BR',
					backend: {
						loadPath: `${dirPath}/{{lng}}/{{ns}}.json`,
					},
					interpolation: {
						escapeValue: false,
					},
					returnEmptyString: false,
				}, () => {
					resolve(this.loadLanguagesDisplayNames(Object.keys(i18next.store.data)));
					this.client.logger.info({ tag: 'Locales' }, 'Sistema de locales inicializado com sucesso');
				});
			}
			catch (e) {
				console.error(e);
			}
		});
	}

	async loadLanguagesDisplayNames(codes) {
		const lw = (s) => s.toLowerCase();
		// eslint-disable-next-line max-statements-per-line
		const langs = codes.reduce((o, l) => { o[l] = {}; return o; }, {});
		codes.forEach(lc => {
			const [language] = lc.split('-');
			try {
				const { main } = require(`cldr-localenames-modern/main/${language}/languages`);
				const display = main[language].localeDisplayNames.languages;
				codes.forEach(l => {
					const langObj = langs[l][lc] = [];
					const [lcode] = l.split('-');
					if (codes.filter(c => c.startsWith(lcode)).length === 1 && display[lcode]) {
						langObj.push(lw(display[lcode]));
					}
					if (display[l]) langObj.push(lw(display[l]));
				});
			}
			// eslint-disable-next-line no-empty
			catch (e) {}
		});
		this.cldr.languages = langs;
		return langs;
	}
};