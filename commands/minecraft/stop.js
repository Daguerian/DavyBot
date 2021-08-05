const Discord = require('discord.js');  //importation necessaire à l'embed seulement
const { exec } = require("child_process")
const {screenName} = require('./config.json');
const { setTimeout } = require('timers');
var dateLog =  require("../../functions/dateLog.js");  //retourne [JJ/MM-hh:mm]


module.exports = {
    name: 'stop',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['off'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'stoppe le serveur',
    usage: '§stop',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    execute(message, args) {    //execution de la commande, ici une template embed
        
        exec(`screen -ls |grep -q "${screenName}"`, (error, stdout, stderr) => {    //verifie si le screen existe
            if (error) {    //si le serveur n'existe pas
                message.channel.send('**le serveur n\'est pas lancé**');
                return;
            }
            if (stderr) {
                console.log(`${dateLog()} stderr: ${stderr}`);
                return;
            }
            console.log(`${dateLog()} Arret du serveur...`)
            exec(`screen -S ${screenName} -X stuff 'stop\r'`, (error, stdout, stderr) => {
            //envoi de la commande "stop" en console
                if (error) {
                    console.log(`Erreur: ${error}`);
                    message.channel.send(`Erreur lors de l\'arret du serveur. \nerreur: ||${error}||`)
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                message.react("⌛")
                // message.channel.send('**commande d\'arret envoyée**')

                setTimeout(checkStopLoop, 2000)   //lance "checkStopLoop" au bout de 3min10

                function checkStopLoop() {
                    var checkStop = setInterval(function() {    //variable, boucle à intervalle qui execute une fonction
                        exec(`screen -ls |grep -q "${screenName}"`, (error, stdout, stderr) => {    //verifie si le screen existe
                            if (error) {    //le screen existe plus, donc le serveur est fermé
                                message.channel.send('**serveur arreté 👍**')
                                message.reactions.resolve("⌛").remove()
                                message.react("✅")
                                console.log(`${dateLog()} Serveur fermé`)
                                return clearInterval(checkStop) //on stoppe la boucle (via sa variable)
                            };
                            if (stderr) console.log(stderr);
                            // console.log(`[${dateLog()}re-tentative de fermeture...`)
                            exec(`screen -dmDR ${screenName} -X stuff 'exit\r'`, (error, stdout, stderr) => {   //envoi un 'exit\r' au sreen, pour le fermer
                                if (error) console.log(error);                                                  //il se fermera si le serveur n'est plus lancé
                                if (stderr) console.log(stderr);
                            })
                        })
                    }, 5000)//intervalle de 5sec
                }
                
            })
        });
    }
};
