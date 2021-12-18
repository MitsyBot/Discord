const { MessageEmbed } = require('discord.js');
module.exports = class MitsyEmbed extends MessageEmbed {
	constructor(data = {}) {
		super(data);
		this.setColor('#F895FB').setTimestamp();
	}

	setDescriptionFromBlockArray(blocks) {
		this.description = blocks.map(lines => lines.filter(l => !!l).join('\n')).filter(b => !!b.length).join('\n\n');
		return this;
	}
};