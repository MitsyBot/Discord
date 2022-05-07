const { InteractionCommand, MitsyEmbed, HTTPrequests } = require('../../../');
module.exports = class CryInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'chorar',
			description: 'Chore para alguem que te deixou chateado(a)',
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

		const selectedImage = await HTTPrequests.getAssetImageUrl('cry');

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:cry.embed_title'))
			.setDescription(
				ctx.locale('commands:cry.embed_description', {
					author: ctx.author.toString(),
					mention: user.toString(),
				}),
			)
			.setImage(selectedImage);

		await ctx.makeMessage({ embeds: [embed] });
	}
};
