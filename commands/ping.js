const { exec } = require("child_process")
module.exports = {
	name: 'ping',
    description: 'Pong !',
    inGuild: true,
    inDMs: true,
	execute(message, args) {
		message.channel.send(`š Pong ! ${Date.now() - message.createdTimestamp} ms \nš API: ${message.client.ws.ping} ms`);
	},
};
