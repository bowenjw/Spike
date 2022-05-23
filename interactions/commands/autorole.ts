import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types/v9';
import { CommandInteraction, MessageActionRow, MessageSelectMenu, TextChannel } from 'discord.js';
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

	async execute(interaction: CommandInteraction) {
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
			try {
				(interaction.options.getChannel('target')! as TextChannel)
					.send({ content: 'Get roles', components: [row] });
			} catch (error) {
				console.log('channel type error')
			}
		
		interaction.followUp({ content: 'Role setup done', ephemeral: true });
	},
};