const Discord = require('discord.js');  //importation necessaire à l'embed seulement
const { exec } = require("child_process")
const {screenName, serverIp, serverName, serverQueryPort} = require('./config.json')
var dateLog =  require("../../functions/dateLog.js");  //retourne [JJ/MM-hh:mm]

module.exports = {
    name: 'start',    //nom de la commande, en accord avec son nom de fichier
    aliases: ['on'],   //alias de la commande, pour l'appeler (sur discord$) de plusieurs manieres
    description: 'Lance le serveur',
    usage: '$start',      //syntaxe, affichée si la commande est saisie mais incorrecte et dans l'help
    inGuild: true,  //utilisable en guild
    execute(message, args) {

        //fonction de lancement du serveur
        function startServer() {
            exec(`screen -dmS ${screenName} && screen -S ${screenName} -X stuff "cd ~/${serverName}/ && ./BeamMP-Server-linux\r"`, (error, stdout, stderr) => { 
                
                if (error) {
                    console.log(`${dateLog()} erreur: ${error}`);
                    message.channel.send('erreur: '+error)
                    return;
                }
                if (stderr) {
                    console.log(`${dateLog()} stderr: ${stderr}`);
                    message.channel.send('std error: '+stderr)
                    return;
                }
                exec(`screen -ls |grep -q "${screenName}"`, (error, stdout, stderr) => {
                if (error) {    //si le screen n'existe deja plus, il n'as pas pu lancer le serveur
                        console.log(`${dateLog()} erreur lancement du serveur \n${error}`)
                        message.channel.send(`**Impossible de lancer le serveur. \nerreur lors de la verification de lancement \n||${error}||**`)
                        return
                    }
                    if (stderr) {
                        console.log(`${dateLog()} stderr: ${stderr}`);
                        return;
                    }
                    console.log(`${dateLog()} Lancement du serveur...`)  //pas d'erreur, "lancement du serveur..."
                    message.react("⌛")

                    const query = new Query({host: serverIp, port: serverQueryPort, timeout: 2000});
                    //query pour recup les infos du serveur
                    setTimeout(checkLoopLatence, 7000)
                    function checkLoopLatence() {
                        var checkLoop = setInterval(function() {
                            query.basicStat()
                            .then((success) => {
                                message.channel.send('**serveur ouvert  👍**')
                                console.log(`${dateLog()} Serveur ouvert`)
                                message.reactions.resolve("⌛").remove()
                                message.react("✅")
                                clearInterval(checkLoop)
                            }
                            ,(failed) => {
                                //console.log('failed')
                            })
                        },2000)
                    }
                    
                })
            })
        }
        
        exec(`screen -ls |grep -q "${screenName}"`, (error, stdout, stderr) => {    //verifie si le screen existe
            if (error) {    //erreur, donc screen innexistant, donc lance le screen du serveur
                return startServer();
            }
            if (stderr) {
                return console.log('std error: '+stderr);
            }
            exec(`exec screen -dmDR ${screenName} -X stuff 'exit\r'`, (error, stdout, stderr) => {
                if (error) console.log(error);
                if (stderr) console.log(stderr);
                exec(`screen -ls |grep -q "${screenName}"`, (error, stdout, stderr) => {
                    if (error) return startServer();
                    if (stderr) return console.log(stderr)
                    message.channel.send('**le serveur est deja lancé !**')
                })
            })
        });
    }
};


