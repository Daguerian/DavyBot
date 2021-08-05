const Discord = require('discord.js');  //importation necessaire à l'embed
const { exec } = require("child_process")
var dateLog =  require("../../functions/dateLog.js");  //retourne [JJ/MM-hh:mm]
// var getFolderSize = require("../fonctions/getFolderSize.js")    //arg fileName, retourne la taille en MB //NON FONCTIONNEL
const fs = require('fs')    //module fs, pour le chargement de fichiers
const { backupFolder, serverName } = require("./config.json");


module.exports = {
    name: 'backup',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['back','bkp'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'Crée un backup du serveur, ou liste les backups dispos',
    usage: '$backup *list',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    cooldown: 5,    //cooldown, en secondes
    doc: '`$backup` créé un backup \n `$backup list` liste les dates de backups disponibles',
    execute(message, args) {    //execution de la commande
        console.log(args)
        if (args[1] == "list" || args[1] == "l") {    //affiche un embed de la liste des backups dispo, si demandé ($backup list)
            const backupsList = fs.readdirSync(backupFolder); //recupere la liste des dossiers dans les backups

            const embed = new Discord.MessageEmbed()
            .setTitle('Backups disponibles')  //titre de l'embed
            .setColor('#FFA500')    //couleur de liseré
            .setAuthor('⚡ Liste des backups')
            .setThumbnail(`${message.client.user.displayAvatarURL()}`)  //image de vignette, l'avatar du bot
            .setTimestamp() //date et heure
            .setFooter(`⚡ Liste des backups - ${message.client.user.username}`)  //footer, avec le nom du bot
            // .setDescription(backupsList.map(folder => folder + " - " + getFolderSize(`${backupFolder}/${folder}`) + " MB").join("\n"));
            .setDescription(backupsList.map(folder => folder).join("\n"));
            
            return message.channel.send(embed); //envoi le message
        }
        else if (args[1] == "" || !args[1]) {  //aucun arguments, donc créé un backup

            console.log(`${dateLog()} Lancement backup du serveur`)
            //création du nom du dossier
            var date = new Date();
            let J = ("0" + date.getDate()).slice(-2);   //0 + la date, puis recupere que les 2 derners caracteres
            let M = ("0" + (date.getMonth() + 1)).slice(-2);    //+1 car janvier est 0
            let A = date.getFullYear();
            let h = ("0" + date.getHours()).slice(-2);
            let m = ("0" + date.getMinutes()).slice(-2);
            var nomDossier = `${A}-${M}-${J}-${h}:${m}`

            exec(`mkdir ${backupFolder}/${nomDossier}`, (error, stdout, stderr) => {    //crée le dossier du backup, avec la date et heure 
                if (error) {    //erreur lors de la création
                    console.log(`Impossible de créer le dossier`)
                    console.log(`Erreur: ${error}`)
                    return message.channel.send("Impossible de créer le dossier du Backup.")
                }
                if (stderr) {   //erreur lors de la création
                    console.log(`Impossible de créer le dossier (stderr)`)
                    console.log(`Erreur: ${error}`)
                    return message.channel.send("Impossible de créer le dossier du Backup.")
                }

                //création du dossier réussie
                console.log(`dossier ${backupFolder}/${nomDossier} créé`)
                exec(`cp -r ~/${serverName}/world* ${backupFolder}/${nomDossier}`, (error, stdout, stderr) => {
                //copiage du dossier World vers le dossier du backup
                    if (error) {    //erreur lors de la copie
                        console.log("Impossible de copier le.s dossier.s world.s")
                        console.log(`erreur: ${error}`)
                        return message.channel.send("Impossible de terminer le backup")
                    }
                    if (stderr) {   //erreur lors de la copie
                        console.log("Impossible de copier le.s dossier.s world.s (stderr)")
                        console.log(`erreur: ${error}`)
                        return message.channel.send("Impossible de terminer le backup")
                    }
                    //copie terminée
                    console.log("Backup terminé")
                    return message.channel.send("Backup terminé. \n`$minecraft backup list` pour consulter la date des backups existants")
                })

            })
        }
        else return message.channel.send("Argument non reconnu");   //argument entré, mais non reconnu
    }
};
