const Discord = require('discord.js');  //importation necessaire à l'embed seulement

module.exports = {
    name: 'dé',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['de','choose','alea'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'génere un nombre aléatoire entre 1 et le nombre demandé',
    usage: '$args <nombre>',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    inDMs: true,    //utilisable en DM
    args: 1,     //demande obligatoirement des arguments
	execute(message, args) {    //execution de la commande, ici une template embed
        if (args[0] >= 2) {
            message.channel.send(`Nombre aléatoire entre 1 et ${args[0]}: **${Math.floor(Math.random() * Math.floor(args[0]))+1}**`);
        }
        else message.channel.send("Ta valeur doit être un entier >= 2")
    }
};
