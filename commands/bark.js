const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bark')
		.setDescription('bark bark bark')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Bark l\'user saisi') 
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName('number')
            .setDescription('Nombre de bark à envoyer (20max)'))
        .addIntegerOption(option =>
            option.setName('delai')
            .setDescription('Delai entre les bark (en s)')),

	async execute(interaction) {
        //verification du nombre de bark
        if (interaction.options.getInteger('number')) {
            if (interaction.options.getInteger('number') > 20) {
                await interaction.reply('Vous ne pouvez pas envoyer plus de 20 bark');
                return;
            }
            if (interaction.options.getInteger('number') < 1) {
                await interaction.reply('Saisis un nombre superieur à 1 !');
                return;
            }
        }

        //verification du delai
        if (interaction.options.getInteger('delai')) {
            if (interaction.options.getInteger('delai') < 1) {
                await interaction.reply('Saisis un delai superieur à 1s !');
                return;
            }
            if (interaction.options.getInteger('delai') > 10) {
                await interaction.reply('Saisis un delai inferieur à 10s !');
                return;
            }
        }
        
        messageNumber = interaction.options.getInteger('number') || 1;
        delay = interaction.options.getInteger('delai') || 1;

        //renvoi le bark à l'user, avec une reverse card si le random est <= 0.1
        var random = Math.random();
        if (random <= 0.1) {
            await interaction.reply('https://wallpaperaccess.com/full/3978280.jpg');
            user = await interaction.user
            try {await user.send('Bark Bark Bark')}
            catch(error) {return;}
            
        }
        
        else {
            user = await interaction.options.getUser('user')
            
            //tente une 1er envoi, si l'utilisateur à bloqué le bot, on sort
            try {
                await user.send('Bark Bark Bark')
            }
            catch(error) {
                await interaction.reply(`Bark impossible. **${user.username}** m\'a probablement bloqué.e 😢`);
                return;
            }
            await interaction.reply(`Zébardi ! ${messageNumber} barks pour **${user.username}** avec un délai de ${delay}s`);
        }

        //envoi des autres bark
        for (let i = 1; i <= messageNumber-1; i++) {
                setTimeout( () => {
                    try {
                        user.send('Bark Bark Bark')
                    }
                    catch(error) {
                        return;
                    }
                }, i * delay * 1000);
        }
	},
};
