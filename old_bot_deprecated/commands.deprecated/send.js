const Discord = require('discord.js');  //importation necessaire à l'embed seulement
var dateLog =  require("../functions/dateLog.js");

module.exports = {
    name: 'send',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['send'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'envoie un message dans le canal demandé',
    usage: '$args <here/id_canal>',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    inDMs: true,    //utilisable en DM
    args: 2,     //demande obligatoirement des arguments
    doc: '$send here <message> envoi un message dans ce même channel, $send <id_chanel> <message> l\'envoi dans le channel demandé',    //une documentation supplementaire, dans le $help commande
	execute(message, args) {    //execution de la commande, ici une template embed
        
        let channelToSend = message.guild.channels.resolve(args[0]) || message.mentions.channels.first()

        if (channelToSend != 'undefined' && channelToSend != null) {
            channelToSend.send(args.slice(1).join(" "))
            .then( () => {
                message.react("✅")
                console.log(`${dateLog()} Message envoyé de ${message.author.tag} dans ${channelToSend.guild} #${channelToSend.name}:\n"${args.slice(1).join(" ")}"`);
            })
            .catch(err => {
                message.react('❌')
                message.channel.send(`Je n'ai pas pu envoyer le message dans <#${channelToSend.id}>. Je n'ai peut être pas les droits... :frowning:`);
            })
        }
        else {
            message.channel.send("Je ne reconnais pas ce canal sur ce serveur :thinking:")
            message.react('❌')
        }
    }
};
