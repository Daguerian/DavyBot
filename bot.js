const { Client, Intents } = require('discord.js');
const {prefix, token, dmServer, dmChannel} = require('./config.json')    //importe fichier le configuration du bot
var dateLog =  require("./functions/dateLog.js"); //retourne l'horodatage, pour logger dans la console

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


//! connexion du bot aux serveurs de discord
client.once('ready', () => {
    console.log(`connecté en tant que ${client.user.tag}`)
})

//! execution d'une commande slash
client.on('interactionCreate', async interaction => {
    //si l'interraction  n'est pas reconnue
	if (!interaction.isCommand()) return;
    
	const { commandName } = interaction;
    
    //detecte la commande
	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});



//lancement, connexion du bot avec son token
client.login(token)
