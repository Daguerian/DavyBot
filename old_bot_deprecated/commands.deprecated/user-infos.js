const Discord = require('discord.js');  //importation necessaire à l'embed seulement
module.exports = {
    name: 'user-infos',
    aliases: ['user-info'],
    description: 'retourne des infos sur les utilisateur taggués, ou l\'auteur s\'il ne tag personne',
    usage: '$user-infos <@user>*',
    inGuild: true,
    doc: 'possibilité de tag plusieurs personnes',
	execute(message, args) {
        if (!message.mentions.users.size) { //si personne n'est taggué, retoune l'auteur (et s'arrete ici)
            const embed = new Discord.MessageEmbed()
            .setColor('#abcc06')
            .setTitle(message.author.username)
            .setThumbnail(message.author.displayAvatarURL())
            .addFields(
                { name: 'Tag', value: message.author.tag, inline: true},
                { name: 'Pseudo serveur', value: message.guild.member(message.author).nickname, inline: true},
                { name: 'Créé le', value: message.author.createdAt},
                { name: 'Serveur rejoins le', value: message.guild.member(message.author).joinedAt}
            )
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setTimestamp()
            .setFooter(message.client.user.username, message.client.user.avatarURL())

            return message.channel.send(embed)
        }


        //retourne toutes les personnes tagguées
        const infos = message.mentions.users.map(user => {  //infos est +/- une liste de chaque personne tagguée
            return message.channel.send(new Discord.MessageEmbed()
                .setColor('#abcc06')
                .setTitle(user.username)
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    { name: 'Tag', value: user.tag, inline: true},
                    { name: 'Pseudo serveur', value: message.guild.member(user).nickname, inline: true},
                    { name: 'Créé le', value: user.createdAt},
                    { name: 'Serveur rejoins le', value: message.guild.member(user).joinedAt}
                )
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTimestamp()
                .setFooter(message.client.user.username, message.client.user.avatarURL())
            )
        })
    }
}