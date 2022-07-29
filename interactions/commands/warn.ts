import {CommandInteraction, ActionRow, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, CommandInteractionOptionResolver, SlashCommandUserOption} from 'discord.js';
import warnSchema from '../../schema/warnschema';
module.exports = {
    global: false,
	data: new SlashCommandBuilder()
		.setName('moderations')
		.setDescription('moderation')
        .addSubcommand(subcommand => 
            subcommand.setName('ban')
            .setDescription('ban member')
            .addUserOption(option => option.setName('member').setDescription('target member').setRequired(true))
            .addStringOption(option => option.setName('duration').setDescription('use if is a tempban'))
            .addStringOption(option => option.setName('reason').setDescription('reason of ban or tempban')))
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup.setName('warn')
            .addSubcommand(subcommand => 
                subcommand.setName('new')
                .setDescription('warn member')
                .addUserOption(option => option.setName('member').setDescription('target member').setRequired(true)))
            .addSubcommand(subcommand => 
                subcommand.setName('clear')
                .setDescription('clear warning(s)')
                .addUserOption(option => option.setName('member').setDescription('target member').setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand.setName('view')
                .setDescription('view warnings of user')
                .addStringOption(option => option.setName('user_id').setDescription('User Discord id').setRequired(true)))),
	async execute(interaction: CommandInteraction) {
        
        const options = interaction.options as CommandInteractionOptionResolver,
            subcommandGroup = options.getSubcommandGroup(false),
            subcommand = options.getSubcommand(true),
            member = options.getMember('member');


    }
};