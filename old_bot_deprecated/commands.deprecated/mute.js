module.exports = {
    name: 'mute',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['m'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'mute/demute en vocal',
    usage: '$mute',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    doc: 'Documention help',    //une documentation supplementaire, dans le $help commande
    execute(message, args) {    //execution de la commande, ici une template embed
        const voiceChannel = message.guild.member(message.client.user).voice.channel
        if (!voiceChannel) return message.channel.send('je ne suis pas conncté en vocal !')
        
        if (message.guild.member(message.client.user).voice.selfMute) return message.guild.member(message.client.user).voice.setSelfMute(false) && message.react('🔊');

        message.guild.member(message.client.user).voice.setSelfMute(true) && message.react('🔇')
    }};