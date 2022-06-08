const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send')
		.setDescription('envoie un message dans le canal demandé')
		.addChannelOption(option =>
			option.setName('channel')
			.setDescription('le canal dans lequel envoyer le message')
			.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('message')
			.setDescription('le message à envoyer (texte ou url)')
			.setRequired(false)
		),
	async execute(interaction) {

		//verif si le channel est visible
		if (!interaction.options.getChannel('channel').viewable) {
			await interaction.reply('je ne peux pas envoyer de message dans ce channel 😔');
			return;
		}
		//verif si le channel est un channel textuel
		if (!interaction.options.getChannel('channel').isText()) {
			await interaction.reply('Ce n\'est pas un canal textuel !');
			return;
		}

		try {
			await interaction.options.getChannel('channel').send(interaction.options.getString('message'))
		}
		catch {
			await interaction.reply('Je n\'ai pas pu envoyer de message dans ce channel 🤔');
			return;
		}
		await interaction.reply('Message envoyé !');
	},
};
