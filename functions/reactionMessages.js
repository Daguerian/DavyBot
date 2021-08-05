const Discord = require('discord.js');  //importation necessaire à l'embed seulement
const dictionnaireReponses = require('../reactionMessages.json')

module.exports = {
    name: 'commande',    //nom de la commande, en accord avec son nom de fichier
    execute(message) {    //execution de la commande, ici une template embed
        
        for (reponse in dictionnaireReponses) { //pour chaques reponses connues dans le dico des reponses,
            if (message.content.toLowerCase().split(' ').includes(reponse)) message.channel.send(dictionnaireReponses[reponse]);
            //passe le message en minuscule, le decoupe mots par mots, et verifie si un des mots correspond à une reponse
        }

        //verifie si le message contient un texte, et y repond
    }
};
