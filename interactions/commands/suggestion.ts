import { ActionRowBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, ModalBuilder, PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Command } from '../../types';
const command: Command = {
	name: 'suggestion',
	description: 'Make a sugestion to the server staff',
	commandBuilder: new SlashCommandBuilder()
		.setName('suggestion')
		.setDescription('Gets the current latencey of the bot')
		.setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option => option
            .setName('suggestion')
            .setDescription('Describe the Suggestion')
            .setRequired(false)),
	async execute(interaction: ChatInputCommandInteraction) {
        const suggestion = new TextInputBuilder()
            .setCustomId("suggestion").setLabel("Suggestion")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('What you would like to suggest')
        
        const suggestionOption = interaction.options.getString('suggestion')
        if(suggestionOption != null) { suggestion.setValue(suggestionOption) }
            
        const modal = new ModalBuilder()
            .setTitle("Server Suggestion")
            .setCustomId("suggestion")
            .setComponents(new ActionRowBuilder<TextInputBuilder>()
                .addComponents(suggestion))
        interaction.showModal(modal)
	},
}
export = command;