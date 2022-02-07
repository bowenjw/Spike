const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord-api-types/v9');
// eslint-disable-next-line no-unused-vars
const { CommandInteraction, MessageActionRow, MessageSelectMenu } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('autorole')
		.setDescription('autoRole Manager')
		.addSubcommand(subcommand =>
			subcommand.setName('rest')
				.setDescription('Add user to brithday list')
				.addChannelOption(option =>
					option.setName('target')
						.setDescription('channel where messages will be set')
						.setRequired(true)
						.addChannelType(ChannelType.GuildText))),
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const menu = new MessageSelectMenu()
			.setCustomId('major')
			.setPlaceholder('Nothing selected')
			.setMinValues(0)
			.addOptions([
				{ label: 'Role A', value: '939913364929380472' },
				{ label: 'Role B', value: '939925834981056570' },
			]);
		menu.setMaxValues(menu.options.length);
		const row = new MessageActionRow()
			.addComponents(menu);
		interaction.options.getChannel('target')
			.send({ content: 'Get roles', components: [row] });
		interaction.followUp({ content: 'Role setup done', ephemeral: true });
	},
};