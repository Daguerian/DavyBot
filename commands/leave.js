const Discord = require('discord.js');
// const ytdl = require('ytdl-core');

module.exports = {
    name: 'leave',
    aliases: ['quit','q'],
    description: 'quitte le canal vocal',
    usage: '$leave',      //syntaxe, affichée si la commande est saisie mais incorrecte
    inGuild: true,  //utilisable en guild
    execute(message, args) {    //execution de la commande
        const voiceChannel = message.guild.member(message.client.user).voice.channel;   //recupere le canal vocal actuellement occupé
        
        if (!voiceChannel) {
            return message.reply('je ne suis pas en vocal :sweat_smile:')
        }
		voiceChannel.leave()
        .then( () => {
            message.react('✅')
        })
        .catch( err => {
            message.channel.send(`Mmh... j'ai rencontré une erreur :thinking: \n||${err}||`)
        })

}};
