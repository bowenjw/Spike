import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import client from '../..';

import { Command } from '../../types'

const command: Command = {
	name: 'ban',
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('ban hammer'),
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		const embed = new MessageEmbed()
			.setColor('BLURPLE')
			.setTitle('Ping!')
			.addFields(
				{ name: 'Command Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
				{ name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true })
			.setTimestamp();
		await interaction.followUp({
		//	content: ,
			ephemeral: true,
			embeds: [embed],
			components: [],
		});
	},
}
export = command;