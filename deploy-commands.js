const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, devGuildId, token } = require('./config.json');

const commands = [];

//Recupere la liste des fichiers .js du dossier commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	//Ajoute chaque commande à l'Array commands
	commands.push(command.data.toJSON());
}

//Initialise la connexion REST avec le token
const rest = new REST({ version: '9' }).setToken(token);

//Deploie la liste des commandes du bot au serveur Discord, pour la guilde saisie
rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

//Deploie la liste des commandes du bot pour toutes les guildes
// rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: commands })
// 	.then(() => console.log('Successfully registered application commands.'))
// 	.catch(console.error);