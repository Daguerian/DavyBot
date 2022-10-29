const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Debug command'),

	async execute(interaction) {

        // await interaction.client.user.setPresence({ activities: [{ name: "Debug Test", type: "PLAYING"}] })
        interaction.client.user.setPresence({ activities: [{ name: `discord.js v14`, type: 4 }], status: 'dnd' })

        interaction.reply('Activité modifiée ✅')
	},
};
