const { InteractionCommand, MitsyEmbed, HTTPrequests } = require('../../');
module.exports = class AngryInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'raiva',
			description: 'Esta com raiva de alguem? demonstre isso.',
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

		const selectedImage = await HTTPrequests.getAssetImageUrl('angry');

		if (user.id === ctx.client.user.id) {
			await ctx.makeMessage({
				content: ctx.locale('commands:angry.mitsy'),
			});
			return;
		}

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:angry.embed_title'))
			.setDescription(
				ctx.locale('commands:angry.embed_description', {
					author: ctx.author.toString(),
					mention: user.toString(),
				}),
			)
			.setImage(selectedImage);

		await ctx.makeMessage({ embeds: [embed] });
	}
};
