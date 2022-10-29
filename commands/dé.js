const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dé')
		.setDescription('Donne un nombre aleatoire entre 1 et le nombre demandé')
		.addIntegerOption(option =>
			option.setName('nombre')
				.setDescription('nombre de faces du dé')
				.setRequired(true)),
	async execute(interaction) {
        
        if (interaction.options.getInteger('nombre') < 2) {
            await interaction.reply('selectionne un nombre superieur à 1');
            return;
        }

        await interaction.reply('🎲 '+ Math.floor(Math.random() * Math.floor(interaction.options.getInteger('nombre'))+1));

    },
};
