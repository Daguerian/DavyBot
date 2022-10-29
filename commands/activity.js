const { SlashCommandBuilder} = require('@discordjs/builders');
const {ActivityType } = require('discord.js');  //types d'activités (changés depuis la v14) https://discord.js.org/#/docs/main/stable/typedef/ActivityType
// const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('activity')
        // .setType(ApplicationCommandType.ChatInput)
		.setDescription('modifie l\'activité du bot')
        .addIntegerOption(option =>
            option.setName('type')
            // .setType(ApplicationCommandOptionType.Integer)
            .setDescription('selectionne le type d\'activité du bot')
            .setRequired(true)
            .addChoices(    //Type Integer
                { name:'joue', value: ActivityType.Playing },
                { name:'écoute', value: ActivityType.Listening },
                { name:'regarde', value: ActivityType.Watching },
                // { name:'stream', value: ActivityType.Streaming },
                // { name:'custom', value:  ActivityType.Custom },
                { name:'compete', value: ActivityType.Competing },
            )
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
        botActivity = interaction.options.getString('activité')// || interaction.client.user.presence.activities[0].name
        botType = interaction.options.getInteger('type')// || interaction.client.user.presence.activities[0].type
        botUrl = interaction.options.getString('url')// || interaction.client.user.presence.activities[0].url

        //verifie si botUrl est un url valide
        if (botUrl && botUrl.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
            await interaction.client.user.setPresence({ activities: [{ name: botActivity, type: botType, url: (botUrl||null)}] })
            
        }
        else {
            await interaction.client.user.setPresence({ activities: [{ name: botActivity, type: botType}] })
        }

        interaction.reply('Activité modifiée ✅')
	},
};
