const { InteractionCommand, MitsyEmbed, HTTPrequests } = require('../../');
module.exports = class BiteInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'cafune',
			description: 'Faça cafuné em alguem que merece muito <3',
			category: 'actions',
			options: [
				{
					name: 'usuário',
					type: 'USER',
					description: 'Mencione um usuário',
					required: true,
				},
			],
			cooldown: 5,
		});
	}

	async run(ctx) {
		const user = ctx.options.getUser('usuário', false);

		const selectedImage = await HTTPrequests.getAssetImageUrl('pat');

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:pat.embed_title'))
			.setDescription(
				ctx.locale('commands:pat.embed_description', {
					author: ctx.author.toString(),
					mention: user.toString(),
				}),
			)
			.setImage(selectedImage);

		await ctx.makeMessage({ embeds: [embed] });
	}
};
