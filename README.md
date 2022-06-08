# Davy - un bot discord polyvalent

##Features:

- Changement d'activité (joue à ..., écoute ..., stream ..., regarde ...)
- Changement de statut (Online, idle, dnd, invisible)
- Gestion d'un serveur minecraft (via une [API](https://github.com/Daguerian/MinecraftServerAPI) qui gere le serveur)
- Envoi de message via le bot dans un autre canal  (`/send <#channel> <message>`)
- Generation d'un nombre aléatoire (`/dé <max>`) 
## Installation
`git clone https://github.com/Daguerian/DavyBot.git`
`npm install`

## Configuration

**./config.json** - config du bot

Les champs de `dmServer` et `dmChannel` sont actuellement inutiles
```json
{
    "token": "token-du-bot",
    "clientId": "id-du-bot-pour-le-deploiement",
    "devGuildId": "id-de-la-guilde-pour-deploiement",
    "dmServer": "id-du-serveur-pour-les-dm",
    "dmChannel": "id-du-channel-pour-les-dm",
    "mcApiPort": "port-de-l'api-minecraft-server"
}
```

## Lancement
Deploiement des commandes:
`npm run deploy`
ça deploie les commandes du dossier `commands/` via le script `deploy-commands.js`

Lancement du bot
`npm run start`