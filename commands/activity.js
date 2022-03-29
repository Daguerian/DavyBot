const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('activity')
		.setDescription('modifie l\'activité du bot')
        .addStringOption(option =>
            option.setName('type')
            .setDescription('selectionne le type d\'activité du bot')
            .setRequired(true)
            .addChoice('play', 'PLAYING')
            .addChoice('stream', 'STREAMING')
            .addChoice('listen', 'LISTENING')
            .addChoice('watch', 'WATCHING')
            // .addChoice('custom', 'CUSTOM')
            .addChoice('competing', 'COMPETING')
        )
        .addStringOption(option =>
            option.setName('activité')
            .setDescription('saisie l\'activité du bot')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('url')
            .setDescription('saisie l\'url de l\'activité, pour le type stream uniquement')
            .setRequired(false)
        ),
	async execute(interaction) {
        // botStatus = interaction.options.getString('status') || interaction.client.user.presence.status
        botActivity = interaction.options.getString('activité') || interaction.client.user.presence.activities[0].name
        botType = interaction.options.getString('type') || interaction.client.user.presence.activities[0].type
        botUrl = interaction.options.getString('url') || interaction.client.user.presence.activities[0].url

        await interaction.client.user.setPresence({ activities: [{ name: botActivity, type: botType, url: botUrl}] })
        interaction.reply('Activité modifiée ✅')
	},
};
