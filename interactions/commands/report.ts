import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types";
import { chatReport } from "../../system/report_modal";
const builder = new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a user or message')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator)
    .addUserOption(option => option
        .setName('target')
        .setDescription('target')
        .setRequired(true))
    .addStringOption(option => option
        .setName('reason')
        .setDescription('Reason Why member is being reported')
        .setRequired(false))
    /*.addChannelOption(option => option
        .setName('channel')
        .setDescription('Channel where misconduct happend')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.GuildStageVoice)
        .setRequired(false))*/


const command:Command = {
    name: builder.name,
    description: builder.description,
    commandBuilder: builder,
    execute: chatReport
}

export = command;