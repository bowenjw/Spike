import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { client } from '../../index';

export const builder = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Gets the current latencey of the bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
	.setDMPermission(true)

export async function execute(interaction: ChatInputCommandInteraction) {
	const embed = new EmbedBuilder()
		.setColor("Blurple")
		.setTitle('Current Latencey')
		.addFields(
			{ name: 'Command Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
			{ name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true })
		.setTimestamp();
	await interaction.reply({ ephemeral: true, embeds: [embed] });
}