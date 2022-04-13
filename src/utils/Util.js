/* eslint-disable no-restricted-syntax */
const {
	MessageSelectMenu,
	MessageActionRow,
} = require('discord.js');

module.exports = class Util {
	static capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	static async collectComponentInteractionWithId(
		channel,
		authorID,
		customId,
		time = 7000,
	) {
		return channel
			.awaitMessageComponent({
				filter: (m) => m.user.id === authorID && m.customId === customId,
				time,
			})
			.then((interaction) => {
				interaction.deferUpdate().catch(() => null);
				return interaction;
			})
			.catch(() => null);
	}

	static async collectComponentInteractionWithCustomFilter(
		channel,
		filter,
		time = 7000,
	) {
		return channel
			.awaitMessageComponent({ filter, time })
			.then((interaction) => {
				interaction.deferUpdate().catch(() => null);
				return interaction;
			})
			.catch(() => null);
	}

	static async collectComponentInteraction(
		channel,
		authorID,
		time = 7000,
	) {
		return channel
			.awaitMessageComponent({
				filter: (m) => {
					if (m.user.id !== authorID) {
						m.reply({
							ephemeral: true,
							content: 'Esta interação não é sua.',
						}).catch(() => null);
					}
					else {m.deferUpdate().catch(() => null);}
					return m.user.id === authorID;
				},
				time,
			})
			.then((interaction) => interaction)
			.catch(() => null);
	}

	static async collectComponentInteractionWithStartingId(
		channel,
		authorID,
		customId,
		time = 7000,
	) {
		return channel
			.awaitMessageComponent({
				filter: (m) => {
					if (m.user.id !== authorID) {
						m.reply({
							ephemeral: true,
							content: 'Esta interação não é sua.',
						}).catch(() => null);
					}
					else {m.deferUpdate().catch(() => null);}
					return m.user.id === authorID && m.customId.startsWith(`${customId}`);
				},
				time,
			})
			.then((interaction) => interaction)
			.catch(() => null);
	}
};

const resolveCustomId = (customId) =>
	customId
		.replace(/^[\s\d]+/, '')
		.replace('|', '')
		.trim();

const actionRow = (components) =>
	new MessageActionRow({ components });

const disableComponents = (
	label,
	components,
) =>
	components.map((c) => {
		c.setDisabled(true);
		if (c instanceof MessageSelectMenu) c.setPlaceholder(label);
		else c.setLabel(label);
		return c;
	});

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

module.exports = { actionRow, resolveCustomId, disableComponents, capitalize };