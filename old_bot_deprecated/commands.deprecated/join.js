// const Discord = require('discord.js');

module.exports = {
    name: 'join',
    aliases: ['j'],
    description: 'rejoins le canal vocal',
    usage: '$join',      //syntaxe, affichée si la commande est saisie mais incorrecte
    inGuild: true,  //utilisable en guild
    execute(message, args) {    //execution de la commande
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('tu pourrais rejoindre un canal vocal avant ? :sweat_smile:')
        }
        if (voiceChannel === message.guild.member(message.client.user).voice.channel) return message.channel.send('Hey ! je suis deja là !');

        voiceChannel.join()
        .then( () => {
            message.react('✅')
        })
        .catch( err => {
            message.react('❌')
            message.channel.send("Je ne peux pas rejoindre le canal. t'es sûr que j'ai les droits ?")
        })
        
}};
