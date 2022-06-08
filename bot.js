// mettre les events dans des fichiers séparés: https://discordjs.guide/creating-your-bot/event-handling.html#reading-event-files

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
// // const {token, dmServer, dmChannel} = require('./config.json')    //importe fichier le configuration du bot
const {token} = require('./config.json')    //importe fichier le configuration du bot
var {dateLog} =  require("./functions/dateLog.js"); //retourne l'horodatage, pour logger dans la console
// // const listeReactionsMessages = require('./reactionMessages.json')

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
client.on('ready', () => {
	console.log(dateLog()+ " Connecté en tant que "+ client.user.tag)
	// console.log(client.ws.gateway)
})

//! lors de la deconnexion
client.on('shardDisconnect', reason => {
	console.log(dateLog()+ " Déconnecté")
})

client.on('shardReconnecting', id => {
	console.log(dateLog()+ " Reconnexion ...")
})

client.on('shardResume', id => {
	console.log(dateLog()+ " Connecté !")
})



client.addListener('error', (message) => {
	console.log(message)
})
//! réponses automatique à certains message (like "quoi" -> feur, "possible" -> gif carte kiwi)
client.on('messageCreate', message => {
	console.log(message)
	if (message.author.bot) return;
	for (reponse in listeReactionsMessages) { //pour chaques reponses connues dans le dico des reponses,
		if (message.content.toLowerCase().split(' ').includes(reponse)) message.channel.send(dictionnaireReponses[reponse]);
		//passe le message en minuscule, le decoupe mots par mots, et verifie si un des mots correspond à une reponse
	}

	//TODO: restaurer le json avec les corresponances ? + securiser (message d'erreur en cas d'absence du fichier)
	//TODO: + ajout possible via une commande, donc ptetre plutot une base de donnée (à moins qu'on edite le fichier)
});


//! execution d'une commande slash
client.on('interactionCreate', async interaction => {
	//si l'interraction  n'est pas reconnue
	if (!interaction.isCommand()) return;
	
	//recupere la commande demandée
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
			await interaction.reply({ content: 'J\'ai rencontré une erreur pendant que j\'executais la commande 😥', ephemeral: true })
			.catch( err => {
				if (err.code == 40060) {	//DiscordAPIError: Interaction has already been acknowledged
					//https://discord.com/developers/docs/topics/opcodes-and-status-codes
					//correspond à un reply deja effectué

					//donc on fetch le reply deja effectué, pour ensuite le modifier
					interaction.fetchReply()
					.then( message => {
						interaction.editReply({ content: 'J\'ai rencontré une erreur pendant que j\'executais la commande 😥', ephemeral: true })
					});
				}
			})
	}
});




//! lancement, connexion du bot avec son token
client.login(token)
.catch(err => {
	console.log(dateLog()+ " Erreur de connexion: "+ err)
})


//! Ferme la connexion proprement lorsque l'on quitte le programme
process.on('SIGINT', () => {	//CTRL +C
	console.log('\n'+ dateLog()+ ' Deconnexion...')
	client.destroy()
})
process.on('SIGQUIT', () => {	//keyboard quit
	console.log('\n'+ dateLog()+ ' Deconnexion...')
	client.destroy()
})
process.on('SIGTERM', () => {	// 'kill' command
	console.log('\n'+ dateLog()+ ' Deconnexion...')
	client.destroy()
})

