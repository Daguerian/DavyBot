const { exec } = require("child_process")
module.exports = {
	name: 'ping',
    description: 'Pong !',
    inGuild: true,
    inDMs: true,
	execute(message, args) {
		message.channel.send(`🏓 Pong ! ${Date.now() - message.createdTimestamp} ms \n🌐 API: ${message.client.ws.ping} ms`);
	},
};
