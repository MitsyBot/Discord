const { InteractionCommand, MitsyEmbed, HTTPrequests } = require('../../');
module.exports = class BiteInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'tapa',
			description: 'De um tapa em alguem que te deixou chateado :(',
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

		const selectedImage = await HTTPrequests.getAssetImageUrl('slap');

		if (user.id === ctx.client.user.id) {
			const embed = new MitsyEmbed()
				.setTitle(ctx.locale('commands:punch.embed_title'))
				.setDescription(
					ctx.locale('commands:punch.embed_description', {
						mention: ctx.author.toString(),
						author: user.toString(),
					}),
				)
				.setImage(selectedImage);

			await ctx.makeMessage({ embeds: [embed] });
			return;
		}

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:slap.embed_title'))
			.setDescription(
				ctx.locale('commands:slap.embed_description', {
					author: ctx.author.toString(),
					mention: user.toString(),
				}),
			)
			.setImage(selectedImage);

		await ctx.makeMessage({ embeds: [embed] });
	}
};
