const Discord = require('discord.js');  //importation necessaire à l'embed seulement

module.exports = {
    name: 'CommandName',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['FirstAliase','SecAlias'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'description',
    usage: '$commandName <arg1> <arg2>',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    inDMs: true,    //utilisable en DM
    args: true,     //demande obligatoirement des arguments
    cooldown: 5,    //cooldown, en secondes
    doc: 'Documentation in $help <commandName>',    //une documentation supplementaire, dans le $help commande
	execute(message, args) {    //execution de la commande, ici une template embed

        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#fa19af')    //couleur du liseré
        .setTitle('Some title') //Titre
        .setURL('https://discord.js.org/')  //URL lié au titre
        .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')    //auteur & image, au dessus du titre
        .setDescription('Some description here')    //texte description
        .setThumbnail('https://i.imgur.com/wSTFkRM.png')    //image de vignette, en haut à droite
        .addFields( //ajout de contenu
            { name: 'Regular field title', value: 'Some value here' },  //mini-titre, avec sa description
            { name: '\u200B', value: '\u200B' },    //vide, espace
            { name: 'Inline field title', value: 'Some value here', inline: true }, //contenu
            { name: 'Inline field title', value: 'Some value here', inline: true }, //à la même ligne
        )
        .addField('Inline field title', 'Some value here', true)    //contenu à la même ligne que les deux au dessus
        .setImage('https://i.imgur.com/wSTFkRM.png')    //insersion d'image
        .setTimestamp()     //ajout de la date/heure à coté du footer
        .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png'); //footer, en bas de page, avec image
    
    message.channel.send(exampleEmbed);

    }
};
