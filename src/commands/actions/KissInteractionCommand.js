const { InteractionCommand, MitsyEmbed, HTTPrequests } = require('../../');
module.exports = class BiteInteractionCommand extends InteractionCommand {
	constructor() {
		super({
			name: 'beijar',
			description: 'Beije alguém especial para você <3',
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

		const selectedImage = await HTTPrequests.getAssetImageUrl('kiss');

		if (user.id === ctx.client.user.id) {
			await ctx.makeMessage({
				content: ctx.locale('commands:kiss.mitsy'),
			});
			return;
		}

		const embed = new MitsyEmbed()
			.setTitle(ctx.locale('commands:kiss.embed_title'))
			.setDescription(
				ctx.locale('commands:kiss.embed_description', {
					author: ctx.author.toString(),
					mention: user.toString(),
				}),
			)
			.setImage(selectedImage);

		await ctx.makeMessage({ embeds: [embed] });
	}
};
