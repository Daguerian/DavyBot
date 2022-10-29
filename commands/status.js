const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('modifie le statut du bot')
        .addStringOption(option => 
            option.setName('status')
                .setDescription('le statut à modifier')
                .setRequired(true)
                .setChoices(
                    { name:'🟢 online', value: 'online' },
                    { name:'🟡 idle', value: 'idle' },
                    { name:'🔴 dnd', value: 'dnd' },
                    { name:'⚪ invisible', value: 'invisible' },
                )
        ),
	async execute(interaction) {

        await interaction.client.user.setPresence({status: interaction.options.getString('status') })
        interaction.reply('Statut modifié ✅')
        // .then((res, rej) => {
        //     interaction.reply('activité modifiée !');
        // })
		// client.user.setPresence({ activities: [{ name: 'with discord.js' }] });

	},
};
