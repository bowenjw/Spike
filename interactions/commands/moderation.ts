import {CommandInteraction, ActionRow, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, CommandInteractionOptionResolver, SlashCommandUserOption} from 'discord.js';
import { Command } from '../../types';
//import warnSchema from '../../schema/warnschema';
export const command:Command = {
    name: 'moderation',
    description: 'moderation command',
    global: false,
    SlashCommandBuilder = new SlashCommandBuilder()
        .setName('moderations')
        .setDescription('moderation')
        .addSubcommand(subcommand => 
            subcommand.setName('ban')
            .setDescription('ban member')
            .addUserOption(option => option.setName('member').setDescription('target member').setRequired(true))
            .addStringOption(option => option.setName('duration').setDescription('use if is a tempban'))
            .addStringOption(option => option.setName('reason').setDescription('reason of ban or tempban')))
        .addSubcommand(subcommand =>
            subcommand.setName('unban')
            .setDescription('unban user')
            .addStringOption(option => option.setName('user_id').setDescription('user id of user to be unban').setRequired(true)))
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
    execute: execute

}
async function execute(interaction: CommandInteraction) {
    
    const officer = interaction.user,
    options = interaction.options as CommandInteractionOptionResolver,
    subcommandGroup = options.getSubcommandGroup(false),
    subcommand = options.getSubcommand(true);
    if(subcommandGroup == "warn"){
        //warn(options);
    }
    else {
        switch (subcommand) {
            case "ban":
                
                break;
            case "unban":
    
                break;
            default:
                break;
        }
    }
    
}