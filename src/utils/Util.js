/* eslint-disable no-restricted-syntax */
const {
	MessageSelectMenu,
	MessageActionRow,
} = require('discord.js');


function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

async function collectComponentInteractionWithId(
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

async function collectComponentInteractionWithCustomFilter(
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

async function collectComponentInteraction(
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

async function collectComponentInteractionWithStartingId(
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

const RandomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const resolveSeparatedStrings = (string) => string.split(' | ');

module.exports = { resolveSeparatedStrings, RandomFromArray, actionRow, resolveCustomId, disableComponents, collectComponentInteractionWithCustomFilter, capitalize, collectComponentInteractionWithStartingId, collectComponentInteraction, collectComponentInteractionWithId };