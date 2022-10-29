const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder  } = require('discord.js');
const https = require('https')
const axios = require('axios')		//requete http
var crypto = require('crypto'); 	//pour chiffrer le token
const fs = require('fs')
const Query = require("minecraft-query")
const { mcApiPort, mcServerAddress } = require('../config');
const { dateLog } = require('../functions/dateLog');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('minecraft')
		.setDescription('commandes liées au serveur minecraft')
		.addStringOption(option =>
			option.setName('commande')
				.setRequired(true)
				.setDescription('commande')
				.addChoices(
					{ name: 'start', value: 'start' },
					{ name: 'stop', value: 'stop' },
					{ name: 'info', value: 'info' },
					{ name: 'mods', value: 'mods' },
					{ name: 'list', value: 'list' },
				)
		),
	async execute(interaction) {

		//! Commande mods
		if (interaction.options.getString('commande') == 'mods') {
			return interaction.reply('Une liste de mods utiles: \nhttps://dl.fcsn.fr/modsMinecraft')
		}

		//! les autres commandes
		autoCommands = []
		// // var reponseApi = "";	//initialise en str vide
		
		//! reponse au message, en attendant la reponse de l'api
		embed = new EmbedBuilder()
		switch (interaction.options.getString('commande')) {
			case 'start':
				embed.setTitle('🟢 Lancement du serveur...')
				.setColor('#00FF00')
				break;
			case 'stop':
				embed.setTitle('🔴 Arret du serveur...')
				.setColor('#FF0000')
				break;
			case 'info':
				embed.setTitle('🔎 Recuperation des infos...')
				.setColor('#0099FF')
				break;
			case 'list':
					embed.setTitle('🔎 Recuperation des joueurs...')
					.setColor('#0099FF')
				// .setColor('#fcf80f')
				break;
			case 'mods':
				embed.setTitle('⚙️ dl.fcsn.fr/modsMinecraft')
				.setURL('https://dl.fcsn.fr/modsMinecraft')
				.setColor('#808080')
				.setThumbnail('https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png')
				.setDescription('Une liste de mods utiles')
				return interaction.reply( { embeds: [embed] } )
		}

			embed.setFooter( {text: mcServerAddress, iconURL: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png'} )
			.setTimestamp()
			interaction.reply( { embeds: [embed] } )


		//! Certificat localhost, pour communiquer avec l'API en HTTPS
		try {
			var httpsAgent = new https.Agent({
				ca: fs.readFileSync("./cert/localhost.crt")
				// requestCert: true, rejectUnauthorized: true
			})
		}
		catch (err) {	//Certificat introuvable
			if (err.code == 'ENOENT') {	//NO ENTry, No such file or directory
				console.error(dateLog()+ " Erreur: le certificat de communication avec l'API minecraft n'a pas été trouvé")
				interaction.fetchReply()
				.then(message => {
					interaction.editReply("⚠️ Impossible de communiquer avec l'API: Certificat local introuvable")
				})
			}
			else {	//Toute autre erreur
				console.error(dateLog()+ " Erreur non traitée: "+ err);
				interaction.fetchReply()
				.then(message => {
					interaction.editReply("⚠️ Erreur non traitée: contactez un administrateur, et verifiez la console")
				})
				
			} 
			return;
		}
		
		//hash du token, pour l'envoi en tant que token d'acces à l'API
		hash = crypto.createHash('sha256');
		hashedToken = hash.update(interaction.client.token)
		hashedToken = hash.digest("hex");

		// console.log("original token: "+ interaction.client.token)
		// console.log("hashed token: "+ hashedToken)

		//! Envoi de la requete
		axios({
			method: 'post',
			url: 'http://localhost:'+mcApiPort+'/'+interaction.options.getString('commande'),
			data: {
				'token':  hashedToken,
				// token: interaction.client.token
				// token: ''
			},
			httpsAgent: httpsAgent,
			headers: {
				'Content-Type': 'application/json',
			}
		})

		//! Traitement de la reponse
		.then(res => {
			switch (interaction.options.getString('commande')) {
				case 'info':
					if (res.data['status'] == 'OK') {
						embed.setTitle('Jazoncraft 🟢')
						.addFields(
							{name: 'Joueurs ', value: `${res.data['content']['onlinePlayers']}/${res.data['content']['maxPlayers']}`, inline: true },
							{name: 'Gametime ', value: res.data['content']['gametime'], inline: true },
							// {name: '\u200b ', value: '\u200b', inline: false },
							{name: 'Difficulté ', value: res.data['content']['difficulty'], inline: true },
							{name: 'Version ', value: res.data['content']['version'], inline: true },
							{name: 'Motd ', value: res.data['content']['motd'], inline: true }
						)
						.setThumbnail('https://eu.mc-api.net/v3/server/favicon/'+mcServerAddress)
						.setTimestamp()
						.setFooter( {text: mcServerAddress, iconURL: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png'} )
						interaction.fetchReply()
						.then(message => interaction.editReply( {embeds: [embed] } ) ); 
						break;
					}
				case 'list':
					if (res.data['status'] == 'OK') {
						// defini la var playerListField, en liste str avec des \n si ya des joueurs, ou en \u200b si personne n'est connecté pour ne pas envoyer du vide
						var playerListField = res.data['content']['players'].map(player => player + '\n').join('') || '\u200b'
						// embed = new EmbedBuilder()
						embed.setTitle('Joueurs Connectés: ')
						// .setColor('#fcf80f')
						.setThumbnail('https://eu.mc-api.net/v3/server/favicon/'+mcServerAddress)
						.addFields( {name: `${res.data['content']['onlinePlayers']}/${res.data['content']['maxPlayers']}`, value: playerListField})	//erreur, value vide si ya pas un caractere avant (wtf ?) donc \r, ça se voir pas mais ça marche c:
						.setTimestamp()
						.setFooter( {text: mcServerAddress, iconURL: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png'} )
						// interaction.reply(`Joueurs connectés: ${res.data['content']['onlinePlayers']}/${res.data['content']['maxPlayers']} \n ${res.data['content']['players'].map(player => player + '\n')}`);
						interaction.fetchReply()
						.then(message => interaction.editReply( {embeds: [embed] } ))
						break;
					} 
					case 'start':
					case 'stop':
						embed.setTitle(res.data['status'])
						.setFooter( {text: mcServerAddress, iconURL: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png'} )
						.setTimestamp()
					interaction.fetchReply()
					.then(message => interaction.editReply( {embeds: [embed] } ))
					break;
				default:
					// interaction.reply("res: "+ JSON.stringify(res.data)); 
					interaction.fetchReply()
					.then(message => interaction.editReply(res.data['status']) ); 
					break;
			}
		})
		.catch(error => {
			console.error(dateLog()+ error.code)
			messageReply = error.message	//par defaut

			if (error.code == 'ECONNREFUSED') {
				messageReply = "Impossible de se connecter à l'API. \nConnexion refusée"
			}

			if (error.code == "CERT_HAS_EXPIRED") {
				messageReply = "Impossible de se connecter à l'API. \nCertificat expiré"
			}

			if (error.code == "ECONNRESET") {	//mauvais protocole ? (http au lieu de https)
				messageReply = "Impossible de se connecter à l'API. \nConnexion réinitialisée"
			}
			
			// Envoie le message d'erreur
			interaction.fetchReply()
			.then(message => interaction.editReply({embeds: [new EmbedBuilder().setTitle(messageReply).setColor("ff0000")]}) ); 
		})
		


		// function sendRequest(data) {
		// 	return new Promise((resolve, reject) => {
		// 		//! parametres de la requete
		// 		const options = {
		// 			hostname: '127.0.0.1',	//TODO: fichier config ?
		// 			port: mcApiPort,
		// 			path: verifCommandPath(),	// https://localhost:port/<commande-saisie>, par defaut
		// 			method: 'POST',
		// 			rejectUnauthorized: false,
		// 			requestCert: true,
		// 			headers: {
		// 			'Content-Type': 'application/json',
		// 			'Content-Length': data.length
		// 			}
		// 		}

		// 		//! requete 
		// 		const req = https.request(options, res => {
		// 			// console.log(`statusCode: ${res.statusCode}`)
					
		// 			res.on('data', d => {
		// 				// process.stdout.write(d)
		// 				reponseApi += d;
		// 			})
					
		// 			res.on('end', () => {
		// 				//log la reponse si c'est un lancement, un arret, ou une erreur
		// 				if (reponseApi.startsWith('🔴') || reponseApi.startsWith('🟢')) {
		// 					console.log(dateLog()+ interaction.user.username+ ": " + reponseApi)
		// 				}
		// 				// return interaction.reply(reponseApi)
		// 				resolve(reponseApi);
		// 			})
		// 		})

		// 		// log l'utilisateur qui a utilisé la commande
		// 		// console.log(dateLog()+ interaction+ ": " + interaction.message.author.username + " a utilisé la commande " + interaction.options.getString('commande'))
		// 		//! event erreur requete
		// 		req.on('error', error => {
		// 			console.error(dateLog() + "🟠 Erreur requete minecraft /"+interaction.options.getString('commande')+':\n'+error.message)
		// 			//si error.message commence par "connect ECONNREFUSED"
		// 			if (error.message.startsWith("connect ECONNREFUSED")) {
		// 				// return interaction.reply('🔴 Erreur: l\'API du serveur minecraft n\'est pas lancée')
		// 				reject("🔴 Erreur: l\'API du serveur minecraft n\'est pas lancée");
		// 			}
		// 			// return interaction.reply('erreur lors de l\'envoi de la requete:\n*' + error + '*')
		// 			reject('erreur lors de l\'envoi de la requete:\n*' + error + '*');
		// 		})

		// 		//ecrit le body dans la requete
		// 		req.write(data)
		// 		req.end()

		// 	})
		// }
		
		
	},
};
