import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { client } from '../../client';
import { Command } from '../../types';
export const command: Command = {
	name: 'ping',
	global: true,
	SlashCommandBuilder: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction: CommandInteraction) {
		const embed = new EmbedBuilder()
			.setColor("Blurple")
			.setTitle('Ping!')
			.addFields(
				{ name: 'Command Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
				{ name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true })
			.setTimestamp();
		await interaction.reply({
			//	content: ,
			ephemeral: true,
			embeds: [embed],
			components: [],
		});
	},
}