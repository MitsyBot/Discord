const flags = [
	{
		flag: 1 << 0,
		name: 'discord_employee',
	},
	{
		flag: 1 << 1,
		name: 'discord_partner',
	},
	{
		flag: 1 << 2,
		name: 'hypesquad_events',
	},
	{
		flag: 1 << 3,
		name: 'bug_hunter',
	},
	{
		flag: 1 << 6,
		name: 'hypesquad_bravery',
	},
	{
		flag: 1 << 7,
		name: 'hypesquad_brilliance',
	},
	{
		flag: 1 << 8,
		name: 'hypesquad_balance',
	},
	{
		flag: 1 << 9,
		name: 'early_supporter',
	},
	{
		flag: 1 << 12,
		name: 'null',
	},
	{
		flag: 1 << 14,
		name: 'bug_hunter',
	},
	{
		flag: 1 << 17,
		name: 'bot_developer',
	},
];

const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
	name: 'perfil',
	description: 'Mostra o seu perfil ou o de algum usuário!',
	options: [
		{
			name: 'usuário',
			type: 'USER',
			description: 'Mencione um usuário',
			required: false,
		},
	],
	permissions: [''],
	/**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

	run: async (client, interaction, args, data) => {
		const user = data.user ?? data.author;
		const arrayBadges = [];

		const guildMember = await interaction.guild.members.fetch(user.id);
		console.log(guildMember);

		for (const flag of flags) {
			switch ((flag.flag & guildMember.user.flags) === flag.flag) {
			case true:
				arrayBadges.push(flag.name);
				break;
			case false:
				/**
				 *@returns null
				*/
				break;
			default:
				/**
				 *@returns null
				*/
			}
		}

		axios({
			url: 'http://185.106.96.238:1234/render/profile',
			method: 'post',
			data: {
				type: user.profileType,
				name: guildMember.user.username,
				money: Number(user.comets).toLocaleString('pt-BR', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}),
				aboutMe: user.aboutme,
				married: user.isMarry,
				partnerName: user.marryWith,
				bgId: user.background,
				stickerId: user.sticker,
				favColor: user.profileColor,
				avatarUrl: guildMember.displayAvatarURL(),
				badges: arrayBadges,
			},
			responseType: 'arraybuffer',
		}).then((profile) => {
			const file = new Discord.MessageAttachment(profile.data, 'profile.png');
			return interaction.editReply({
				files: [file],
			});
		});
	},
};
