// mettre les events dans des fichiers séparés: https://discordjs.guide/creating-your-bot/event-handling.html#reading-event-files

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const {prefix, token, dmServer, dmChannel} = require('./config.json')    //importe fichier le configuration du bot
var dateLog =  require("./functions/dateLog.js"); //retourne l'horodatage, pour logger dans la console

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

//recupere les commandes du dossier commands/
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	//Ajoute la commande à la Collection,
	//avec son nom comme key, et le module.export comme value
	client.commands.set(command.data.name, command);
}


//! connexion du bot aux serveurs de discord
client.once('ready', () => {
    console.log(`connecté en tant que ${client.user.tag}`)
})

//! execution d'une commande slash
client.on('interactionCreate', async interaction => {
    //si l'interraction  n'est pas reconnue
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'J\'ai rencontré une erreur pendant que j\'executais la commande 😥', ephemeral: true });
	}
});



//lancement, connexion du bot avec son token
client.login(token)