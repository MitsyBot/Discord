module.exports = {
	createOptionHandler(structureName, structureOptions, options = {}) {
		if (!options.optionalOptions && typeof options === 'undefined') {
			throw new Error(`A opção da estrutura "${structureName}" não pode ser undefined.`);
		}

		return ({
			optional(name, defaultValue = null) {
				const value = structureOptions[name];

				return typeof value === 'undefined'
					? defaultValue
					: value;
			},

			required(name) {
				const value = structureOptions[name];

				if (typeof value === 'undefined') {
					throw new Error(`A opção "${name}" da estrutura "${structureName}" não pode ser undefined.`);
				}
				return value;
			},
		});
	},
};