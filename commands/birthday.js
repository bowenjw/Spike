const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { CommandInteraction, MessageEmbed, GuildMember, MessageActionRow, MessageSelectMenu } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('birthday')
		.setDescription('test')
		.addSubcommand(subcommand =>
			subcommand.setName('list')
				.setDescription('Shows all birthdays in list'),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('add')
				.setDescription('Add user to brithday list')
				.addUserOption(option =>
					option.setName('target')
						.setDescription('User to add to the list')
						.setRequired(true))
				.addIntegerOption(option =>
					option.setName('month')
						.setDescription('Targets birthmonth')
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(12)
						.addChoices([
							['January', 1],
							['Febuary', 2],
							['March', 3],
							['April', 4],
							['May', 5],
							['June', 6],
							['July', 7],
							['August', 8 ],
							['September', 9 ],
							['October', 10 ],
							['November', 11 ],
							['December', 12 ] ]))
				.addIntegerOption(option =>
					option.setName('day')
						.setDescription('Targets birthday')
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(31)),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('remove')
				.setDescription('Remove user to brithday list')
				.addUserOption(option =>
					option.setName('target')
						.setDescription('User to remove to the list')
						.setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('next')
				.setDescription('when is the next birthday'),
		),
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		console.log(interaction.options);
		let embed = new MessageEmbed();
		/**
		 * @type {GuildMember}
		 */
		// const target = interaction.options.getMember('target');
		switch (interaction.options.getSubcommand()) {
		case 'add':
		case 'remove':
			await interaction.reply({ content: 'Birthday list has been updated.', ephemeral: true });
			break;
		case 'list':
			embed = embed.setColor('AQUA')
				.setTitle('Birthday List');
			await interaction.reply({ embeds: [embed] });
			break;
		default:
			break;
		}
	},
};
