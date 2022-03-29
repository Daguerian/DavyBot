const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply(`🏓 Pong ! ${Date.now() - interaction.createdTimestamp} ms \n🌐 API: ${interaction.client.ws.ping} ms`);
	},
};
