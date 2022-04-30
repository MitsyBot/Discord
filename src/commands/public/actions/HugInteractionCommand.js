const { InteractionCommand, MitsyEmbed, HTTPrequests } = require('../../../');
module.exports = class BiteInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'abraço',
			description: 'Abrace alguem especial para você <3',
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

		const selectedImage = await HTTPrequests.getAssetImageUrl('hug');

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:hug.embed_title'))
			.setDescription(
				ctx.locale('commands:hug.embed_description', {
					author: ctx.author.toString(),
					mention: user.toString(),
				}),
			)
			.setImage(selectedImage);

		await ctx.makeMessage({ embeds: [embed] });
	}
};
