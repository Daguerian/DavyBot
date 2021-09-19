const Discord = require('discord.js');  //importation necessaire à l'embed seulement
var dateLog =  require("../functions/dateLog.js");

module.exports = {
    name: 'bark',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['bark'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'spam bark en DM à un user',
    usage: '$bark <tag/id user> <nombre de barks*>',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    inDMs: false,    //utilisable en DM
    args: 1,     //demande obligatoirement des arguments
    cooldown: 3,    //cooldown, en secondes
    doc: 'le nombre est facultatif, et est à 5 par defaut (20 maxi)',    //une documentation supplementaire, dans le $help commande
    execute(message, args) {    //execution de la commande, ici une template embed

        try {
            // message.client.users.cache.get(args[0]).send(args.slice(1).join(", "))
            let dmUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);
            
            
            if (typeof dmUser != 'undefined') { //verifie que l'user est bien valide
                if (dmUser.user.bot) return message.channel.send("Je ne peut pas m'envoyer de message à moi-même, ou un autre bot")    //verifie que la personne n'est pas un bot (lui-même)
                barkLoopNumber = parseInt(args[1])  //convertis la valeur en int, pour verifier que c'est bien un int entre 1 e 20
                if (barkLoopNumber != args[1] && typeof args[1] != 'undefined') return message.channel.send(`"${args[1]}" n'est pas un nombre valide`)
                if (typeof args[1] == 'undefined') barkLoopNumber = 5; //set le nombre de message à 5, si il n'as pas été saisi (=undefined si non saisi)
                else if (barkLoopNumber > 20) return message.channel.send(`${barkLoopNumber} ?? non, je ne peut pas en envoyer plus de 20`)
                else if (barkLoopNumber < 1) return message.channel.send(`${barkLoopNumber} ?? non, choisis un nombre superieur à 1 quand même !` )

                for (let i = 1; i <= barkLoopNumber; i++) {    //spamme BARK le nombre de fois demandé
                    dmUser.send(`BARK BARK BARK BARK BARK`)
                    .catch( err => {
                        console.log(dateLog()+ dmUser.user.tag + " impossible a barker")
                        message.channel.send("Je n'ai pas pu lui envoyer le message. iel m'a surement bloqué... :frowning:")
                        //bug à coriger ici
                    })
                    // plante ici si la personne a bloquée le bot
                }
                console.log(dateLog()+ " "+ dmUser.user.tag + " barké " + barkLoopNumber + "x par " + message.author.tag)    //log console
                message.react("✅")
            }
            else return message.channel.send("Je ne connais pas cette personne :thinking:")
            
        }
        catch (err) {
            message.channel.send(`Je n'ai pas pu spammer BARK :frowning: \n erreur: ||${err}||`)
        }


    }
};
