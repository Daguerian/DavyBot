const fs = require('fs')    //module fs, pour le chargement de fichiers
const Discord = require('discord.js')
const {prefix, token, dmServer, dmChannel} = require('./config.json')    //importe fichier le configuration du bot
var dateLog =  require("./functions/dateLog.js"); //retourne l'horodatage, pour logger dans la console
const { name } = require('./commands/help')
const reactionMessage = require('./functions/reactionMessages.js')    //importe script qui gere les réactions aux messages (contenus dans reactionMessages.json)
const client = new Discord.Client()
client.commands = new Discord.Collection()
const cooldowns = new Discord.Collection();

//importe les commandes, depuis chaque fichiers js
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}


//connexion à Discord
client.once('ready', () => {
    console.log(`connecté en tant que ${client.user.tag}`)
})

//event reception de message
client.on('message', message => {
    
    //envoi des DM dans le canal #dms associé au bot
    if (!message.content.startsWith(prefix) && message.channel.type == "dm" && !message.author.bot) {
        try {
            message.client.guilds.cache.get(dmServer).channels.cache.get(dmChannel).send(`[${message.author}]: ${message.content}`)
        }
        catch(error) {
            console.log(dateLog()+" Impossible d'envoyer le DM reçu dans le canal des DMs");
            console.log("DM reçu: " + message.author + ": " + message.content);
        }
    }

    
    if (message.author.bot) return;  //ne fais rien si le message viens du bot lui-même

    if (!message.content.startsWith(prefix)) return reactionMessage.execute(message)    //detecte si c'est un simple message, et y réagit si il doit y reagir


    // console.log(`[#${message.channel.name} - ${message.author.tag}] ${message.content}`) //affiche les messages en console
    
    //*! Deprécié, à l'epoque d'un bug de mentions sur l'application mobile de discord
    try {   //correction bug tag mobile
        // let tags    //defini tags (une liste)
        let tags = message.content.split('<<@&440841925558534155>')//[1].split('>')   //crée une liste d'avant-apres
        let tagsReturn = '' //defini en str
        tags.splice(0,1)    //supprime le 1er terme, n'étant pas un id
        for (id in tags) {
            tags[id] = tags[id].split(">")[0]   //redecoupe chaque terme, avant le ">" pour ne garder que l'id
            tagsReturn += `<@!${tags[id]}> `    // et l'ajoute dans une str, renvoyée sur Discord
        }
        if (tagsReturn.length) message.channel.send(tagsReturn)
        }
        catch(error){
            console.log(error);
        }
    //*! -----------------------------------------------------------------------------


    if (!message.content.startsWith(prefix)) return;    //s'arrete ici si le message n'est pas une commande

    const args = message.content.slice(prefix.length).trim().split(' ');    //separe chaque mots, tel des arguments
    const commandName = args.shift().toLowerCase(); //recupere la commande depuis l'args[0], et le retire des args

    const command = client.commands.get(commandName)    //recupere la commande via son nom ou son alias
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return message.channel.send('je n\'ai pas reconnu ta commande.\nliste complete `$help`');
    //retourne commande inconnue si la commande n'est pas dans la liste des commandes, ni en alias

    if (args.length < command.args) { //si la commande necessite plus d'arguments que fournis
        if (command.args == 1) return message.channel.send(`\`${command.name}\` demande ${command.args} argument obligatoire, ${message.author} ! \nsyntaxe: \`${command.usage}\`\nTu peux aussi consulter le \`$help ${command.name}\``);    //singulier
        else return message.channel.send(`\`${command.name}\` demande ${command.args} arguments obligatoires, ${message.author} ! \nsyntaxe: \`${command.usage}\`\nTu peux aussi consulter le \`$help ${command.name}\``);    //pluriel
    }
    if (!command.inGuild && message.channel.type === 'text') {  //si la commande est demandée en guild, mais non autorisée en guild
        return message.channel.send(':warning: Je ne peux pas faire ça sur un serveur !')
    }
    if (!command.inDMs && message.channel.type === 'dm') {      //si la commande est demandée en DM, mais non autorisée en DM
        return message.channel.send(':warning: Je ne peux pas faire ça en DM \nallons sur un serveur :globe_with_meridians:')
    }
    
    //gestion cooldown
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;  //1sec, cooldown par defaut, pour tout
    
    if (timestamps.has(message.author.id)) {
    	const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`attend encore ${timeLeft.toFixed(1)}s avant de refaire \`${command.name}\``);
    }   }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
    //execution de la commande
    try {
        command.execute(message, args);
    } catch (error) {
        console.log(error)
        message.reply(`je n\'ai pas pu executer la commande :frowning: \n erreur: ||\`${error}\`||`)
    }
})
//lancement, connexion du bot avec son token
client.login(token)
