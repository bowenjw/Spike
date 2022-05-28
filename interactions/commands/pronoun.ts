import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed} from 'discord.js';
import { ChannelType } from 'discord-api-types/v10';
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pronoun')
		.setDescription('manage Pronoun message')
        .addSubcommand(subCommand => 
            subCommand.setName('new')
                .setDescription('create new pronoun message')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('target channel')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role1')
                        .setDescription('role one'))),
		
	async execute(interaction: CommandInteraction) {
		
	},
};