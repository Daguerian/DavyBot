const Discord = require('discord.js');  //importation necessaire à l'embed seulement
const fs = require('fs')    //module fs, pour le chargement de fichiers
const { backupFolder, serverName } = require("./beammp/config.json");

let mcCommandsList = [];
let newArgs = []

//importe les commandes, depuis chaque fichiers js
const commandFiles = fs.readdirSync('./commands/beammp/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./beammp/${file}`);
    mcCommandsList.push(command)
}

module.exports = {
    name: 'beammp',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['bmp'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'Gere le serveur BeamMP',
    usage: '$beammp <command>',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    inDMs: true,    //utilisable en DM
    args: 1,     //demande obligatoirement des arguments
    doc: '\`start\`: lance le serveur\n\
    \`stop\`: stoppe le serveur\n\
    \`infos\`: donne des infos sur le serveur\n\
    \`mods\`: affiche la liste des mods installés',    //une documentation supplementaire, dans le $help commande
	execute(message, args) {    //execution de la commande, ici une template embed
        for (const command of mcCommandsList) {
            if (args[0] == command.name || command.aliases.includes(args[0])) {   //si la commande minecraft est reconnue parmis les commandes dispo
                // if (args.length <= 1) newArgs = ""; else newArgs = args;
                return command.execute(message, args)  //envoi le message pour toutes ses datas, et les arguments sans le premier (car l'argument[0] est la commande demandée ici)
                                                //retourne du vide s'il n'y a qu'un seul argument, sinon le shift() renvoi une str
            }
        }
        message.channel.send("la commande n'est pas reconnue parmis les commandes beammp \nverifie le \`$help beamp\`")

    




    }
};
