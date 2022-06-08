const Discord = require('discord.js');  //importation necessaire à l'embed seulement
var dateLog =  require("../functions/dateLog.js");
const aliasWatch = ['watching','watch','regarde']
const aliasPlay = ['playing','play','joue']
const aliasListen = ['listening','listen','ecoute']

module.exports = {
    name: 'activity',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['act'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'change d\'activité',
    usage: '$activity <type> <activité>',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    inDMs: true,    //utilisable en DM
    args: true,     //demande obligatoirement des arguments
    doc: 'Types d\'activités: \n*- watch \n- play \n- listen* \nsupprimer le Statut: \n$activity del',    //une documentation supplementaire, dans le $help commande
    execute(message, args) {    //execution de la commande, ici une template embed
        function setActivity(actType) { //fonction pour le changement d'activité
        message.client.user.setPresence({activity: {name: nomActivite, type: actType}});
    }
    const actType = args.shift().toLowerCase()  //recupere le 1er mot
    const nomActivite = args.join(' ')

        if (aliasPlay.includes(actType)) {
            setActivity('PLAYING')
            console.log(`${dateLog()} activity: joue à ${nomActivite}`)
            message.react("✅")
        }
        else if (aliasWatch.includes(actType)) {
            setActivity('WATCHING')
            console.log(`${dateLog()} activity: regarde ${nomActivite}`)
            message.react("✅")
        }
        else if (aliasListen.includes(actType)) {
            setActivity('LISTENING')
            console.log(`${dateLog()} activity: écoute ${nomActivite}`)
            message.react("✅")
        }
        else if (actType == 'del') {
            setActivity('')
            console.log(`${dateLog()} activity: supprimé`)
            message.react("✅")
        }
        else {
            message.channel.send('je ne connais pas ce type d\'activité... :thinking: \nverifie le `$help activity` !')
        }
    }
};
