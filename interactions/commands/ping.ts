import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { client } from '../../index';
import { Command } from '../../types';
const command: Command = {
	name: 'ping',
	description: 'Gets the ping of the bot',
	global: true,
	commandBuilder: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Gets the current latencey of the bot')
		.setDMPermission(true),
	async execute(interaction: CommandInteraction) {
		const embed = new EmbedBuilder()
			.setColor("Blurple")
			.setTitle('Current Latencey')
			.addFields(
				{ name: 'Command Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
				{ name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true })
			.setTimestamp();
		await interaction.reply({ ephemeral: true, embeds: [embed] });
	},
}
export = command;