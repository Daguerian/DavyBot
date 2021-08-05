
const { rejects } = require('assert');
const Discord = require('discord.js');
const https = require('https');
const { resolve } = require('path');


module.exports = {
    name: 'nh',
    aliases: ['nh'],
    description: 'retournes les tags pour l\'id nh donné',
    usage: '$nh <id>',      //syntaxe, affichée si la commande est saisie mais incorrecte
    inGuild: true,  //utilisable en guild
    inDMs: true,
    args: 1,
    execute(message, args) {    //execution de la commande
        var id = args[0]

        function getTags(id) {
            return new Promise((resolve, reject) => {
                pathRequete = `/g/${id}/`
                const request = https.request({hostname: 'nhentai.net', port: 443, path: pathRequete, method: 'GET'}, res => {
                    // console.log("statuscode: "+res.statusCode)
                    res.setEncoding('utf-8')
                    let data;

                    res.on('data', d => {
                        data += d;
                    })

                    res.on('end', () => {
                        try {
                            tags = data.split('<div class="tag-container field-name ">\n								Tags:')[1].split('</div>')[0]
                            tagsList = tags.split('<span class="name">')
                            tagsList.shift()    //retire le [0]
                            for (let i = 0; i < tagsList.length; i++) {
                                tagsList[i] = tagsList[i].split('</span>')[0]
                            }
                            resolve(tagsList)
                        }
                        catch {
                            if (res.statusCode == 404) reject('id invalide - page introuvable')
                            else reject('Impossible de recuperer les tags\ncode: '+res.statusCode)
                        }
                    })
                    res.on('error', () => {
                        reject(error.message)
                    })
                })
                request.end()
            })
        }

        getTags(id)
        .then((resolve, reject) => {
            const embed = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle("Lien Direct")
            .setURL("https://nhentai.net/g/"+id)
            .addField('Tags:', tagsList.map(tag => tag).join('\n'))

            message.channel.send(embed)
        })
        .catch(reject => {
            message.channel.send(reject)
        })

        
}};
