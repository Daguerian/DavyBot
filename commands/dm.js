const Discord = require('discord.js');  //importation necessaire à l'embed seulement
var dateLog =  require("../functions/dateLog.js");

module.exports = {
    name: 'dm',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['mp'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'envoi un DM à la personne demandée',
    usage: '$dm <id/tag user> <message>',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    inDMs: true,    //utilisable en DM
    args: 2,     //demande obligatoirement des arguments
    cooldown: 3,    //cooldown, en secondes
	execute(message, args) {    //execution de la commande, ici une template embed
        let dmUser
        try {
            //si la commande est en DM, cherche l'user parmis toutes les guildes du bot
            // console.log(message.client.guilds.cache)
            if (message.channel.type == 'dm') message.client.guilds.cache.forEach(guild => {
                dmUser = guild.members.cache.get(args[0]) || guild.member(message.mentions.users.first())
            })

            //sinon, cherche parmis le serveur actuel
            else dmUser = message.guild.members.cache.get(args[0]) || message.guild.member(message.mentions.users.first());

            if (typeof dmUser != 'undefined' && dmUser != null) {
                // dmUser.createDM()
                if (dmUser.user.bot) return message.channel.send("Je ne peut pas m'envoyer de message à moi-même, ou un autre bot")    //verifie que la personne n'est pas un bot (lui-même)
                // dmUser.send(`${message.author.tag} ${args.slice(1).join(" ")}`)  //user qui a fait la commande + message
                dmUser.send(`${args.slice(1).join(" ")}`)   //juste le message
                .then( () => {
                    message.react("✅")
                    console.log(`${dateLog()} DM envoyé de ${message.author.tag} à ${dmUser.user.tag}:\n"${args.slice(1).join(" ")}"`)
                })
                .catch(err => {
                    message.react('❌')
                    message.channel.send("Je n'ai pas pu lui envoyer le message. iel m'a surement bloqué... :frowning:")
                })
            }
            else {
                message.channel.send("Je ne connais pas cette personne :thinking:")
                message.react('❌')
            }
            
        }
        catch (err) {
            message.channel.send(`Je n'ai pas pu envoyer le message :frowning: \n erreur: ||${err}||`)
        }


    }
};
