module.exports = {
    name: 'status',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['stat'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'change de status',
    usage: '$status <statut>',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    inDMs: true,    //utilisable en DM
    args: 1,     //demande obligatoirement des arguments
    doc: 'statuts: \n*1 - online \n2 - idle \n3 - dnd*',    //une documentation supplementaire, dans le $help commande
	execute(message, args) {    //execution de la commande, ici une template embed
        const statuts = ['online', 'idle', 'dnd']

        const arg = parseInt(args[0])   //convertis en int, si c'est un nombre
        if (arg && 1 <= arg && arg <= 3) return message.client.user.setStatus(statuts[arg-1]);  //applique le status du x eme statut dans la liste
        if (statuts.includes(args[0])) return message.client.user.setStatus(args[0]);   //applique le statut demandé

        message.channel.send('Je ne connais pas ce statut... :thinking: \n verifie le `$help status`')  //statut non reconnu
    }
};
