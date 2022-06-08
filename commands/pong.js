const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pong')
		.setDescription('Replies with Ping!')
		// .addStringOption(option =>
		// 	option.setName('input')
		// 		.setDescription('The input to echo back')
		// 		.setRequired(true)
		// )
		.addSubcommand(subcommand =>
			subcommand.setName('command1')
			.setDescription('Replies with Ping!')
			.addStringOption(option =>
				option.setName('input1')
				.setDescription('The input to echo back')
			)
			.addUserOption(option =>
				option.setName('input2')
				.setDescription('The input to echo back')
			)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('command2')
			.setDescription('Replies with Ping!')
			.addStringOption(option =>
				option.setName('input3')
				.setDescription('The input to echo back')
			)
		),
	async execute(interaction) {
		await interaction.reply('🏓 Ping ! '+ interaction.options.getString('input1'));
		
	},
};
