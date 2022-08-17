import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { client } from '../../client';
import { Command } from '../../types';
const command: Command = {
	name: 'ping',
	description: 'Gets the ping of the bot',
	global: true,
	commandBuilder: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report user')
		.setDMPermission(false)
        .addUserOption((option) => 
            option.setName("user")
            .setDescription("User being reported")
            .setRequired(true))
        .addStringOption((option) =>
            option.setName("reason")
            .setDescription("Why are your reporting this user?")
            .setRequired(true))
        .addStringOption((option) =>
            option.setName("message_id")
            .setDescription("ID of message to add additional context")
            .setRequired(false))
        .addAttachmentOption((option) =>
            option.setName("screenshot"))
            .setDescription(),
	async execute(interaction: CommandInteraction) {
	},
}
export = command;