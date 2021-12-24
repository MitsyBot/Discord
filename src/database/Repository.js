/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
module.exports = class Repository {
	constructor() {
		if (this.constructor === Repository) throw new Error('Cannot instantiate abstract class');
	}

	parse(entity) {}

	add(entity) {}

	findOne(id) {}

	findAll() {}

	get(id) {}

	remove(id) {}
};