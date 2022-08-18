import { CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { client } from '../../client';
import { report } from '../../system/report';
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
            option.setName('user')
            .setDescription('User being reported')
            .setRequired(true))
        .addStringOption((option) =>
            option.setName('reason')
            .setDescription('Why are your reporting this user?')
            .setRequired(true))
        .addAttachmentOption((option) =>
            option.setName('screenshot')
            .setDescription('Addition context')
            .setRequired(false)),
	async execute(interaction: CommandInteraction) {
        report(interaction)
	},
}
export = command;