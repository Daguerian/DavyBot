module.exports = {
    name: 'reload',
    aliases: ['rl'],
    description: 'recharge la commande demandée',
    usage: '$reload <commande>',      //syntaxe, affichée si la commande est saisie mais incorrecte
    inGuild: true,  //utilisable en guild
    inDMs: true,    //utilisable en DM
    args: 1,     //demande des arguments
    cooldown: 3,
	execute(message, args) {    //execution de la commande
        if (!args.length) return message.channel.send(`dis-moi quelle commande je dois relancer, ${message.author}!`);
        const commandName = args[0].toLowerCase();  //recupere l'argument
        const command = message.client.commands.get(commandName)    //cherche l'argument dans la liste des commandes
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
        if (!command) return message.channel.send(`Je ne reconnais pas cette commande... :thinking:`);  //commande inconnue

        delete require.cache[require.resolve(`./${command.name}.js`)];
        try {   //recharge la commande
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`J'ai rechargé \`${command.name}\`:+1: `);
        } catch (error) {
            console.log(error);
            message.channel.send(`Desolé, mais je n'ai pas pu recharger \`${command.name}\` :frowning:\nerreur: ||\`${error.message}\`||`);
        }
        
            }
};
