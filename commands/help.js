const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'liste des commandes',
    usage: '$help <commande>*',      //syntaxe, affichée si la commande est saisie mais incorrecte
    inGuild: true,  //utilisable en guild
    inDMs: true,    //utilisable en DM
    execute(message, args) {    //execution de la commande
        const data = [];
        const { commands } = message.client;

        //sans arguments, envoi un DM avec les commandes
        if (!args.length) {
            const embed = new Discord.MessageEmbed()
            .setTitle('Commandes disponibles')  //titre de l'embed
            .setColor('#0627cc')    //couleur de liseré
            .setAuthor('❗ $help <commande> pour plus d\'infos')
            .setThumbnail(`${message.client.user.displayAvatarURL()}`)  //image de vignette, l'avatar du bot
            .setTimestamp() //date et heure
            .setFooter(`❓ aide generale - ${message.client.user.username}`)  //footer, avec le nom du bot
            .setDescription(commands.map(command => `\`${command.name}\`: ${command.description}`).join('\n')); //liste des commandes avec leur description

            return message.channel.send(embed)   //Envoi de l'aide
        }
        //saisie d'argument, renvoi les infos de la commande
        const name = args[0].toLowerCase(); //recupere le nom de la commande saisi
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));    //recupere la commande, avec son nom ou son alias

        if (!command) { //commande non reconnue
            return message.reply('cette commande n\'est pas valide');
        }
        const embed = new Discord.MessageEmbed()
            .setColor('#0627cc')
            .setAuthor(`aide ${command.name}`)
            .setThumbnail(message.client.user.displayAvatarURL())
            .addFields(
                { name: 'Nom', value: command.name, inline: true},  //nom et alias à cotés
                { name: 'alias', value: command.aliases || 'N/A', inline: true},
                {name: '\u200B', value: '\u200B'},  //vide, pour separer les lignes Nom et Serveur/DM
                { name: 'serveur', value: command.inGuild ? 'Oui':'Non', inline: true}, // si command.inGuild est true, retourne 'oui', sinon retourne 'non
                { name: 'DM', value: command.inDMs ? 'Oui': 'Non', inline: true},
                { name: 'arguments obligatoires', value: command.args ? 'Oui': 'Non'},
                { name: 'cooldown', value: `${command .cooldown || 1} sec`},    //affiche le cooldown general d'1 sec si aucun cooldown n'est defini
                { name: 'syntaxe', value: command.usage || 'pas de synxate definie'}    //affiche la syntaxe si definie
            )
            .setFooter(`❓ aide ${command.name} - ${message.client.user.username}`) //
            .setTimestamp();    //date/heure au footer
            command.doc ? embed.addField('infos supplementaires', command.doc || '') : {}   //ajoute la doc si definie, sinon continue sans rien ajouter
            message.channel.send(embed)
    }
};
