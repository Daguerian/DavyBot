# DavyBot
un bot discord, assez universel, toujours en dev, qui me sert de base principale pour d'autres bots

# Installation
(plus de precisions soon)  
Installer nodejs, et npm  
```bash
npm install --save
```
et Paf, des chocapics
plus qu'a le lancer avec ```node bot.js```  


# Features
- gestion d'un serveur minecraft
Lance, ou stoppe le serveur dans un <a href="https://wiki.debian.org/fr/Screen">Screen</a>
Crée des backups, de tous les dossiers (et fichiers !) commençant par world (~/${serverName}/world*) vers un dossier contenant les backups
Recupere des infos sur le serveur, un fois lancé (joueurs, version, "ip" d'acces)

- modifie son activité
"joue à/regarde/écoute" <texte>

- envoi/reception de DMs
    
- envoyer des messages en channel
    
- repondre automatiquement un message, si un message trigger est detecté (reactionMessages.json)

- rejoindre/quitter un vocal, et de mute/demute
    
- un help general, et un help pour chaque commande
    
# Fichiers de config

### **./config.json** - config du bot
```json
{
    "prefix": "prefix_symbol",
    "token": "bot_token",
    "dmServer": "guild_id_for_receive_dms_in_str",
    "dmChannel": "channel_id_in_the_guild_in_str"
}
```

### **./commands/minecraft/config.json** - config du serveur minecraft
```json
{
    "serverName": "name_of_the_server",
    "screenName": "name_of_the_GNU_Screen",
    "serverJoinIp": "server_adress_to_display",
    "serverIp": "server_ip_adress",
    "serverQueryPort": "query_port",
    "backupFolder": "folder_contain_backups"
}
```
Désactiver la gestion du serveur minecraft:  
    - rm commands/minecraft.js  
    - rm minecraft/  
    
### **./commands/BeamMP/config.json** - config du serveur BeamMP (pas encore ajouté)
```json
    {
    " ":" "
    }
```
Désactiver la gestion d'un serveur BeamMP:  
    - rm commands/beammp.js  
    - rm beammp/  
