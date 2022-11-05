import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { chatReport } from "../../system/report_modal";

export const builder = new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a user or message')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
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
export {chatReport as execute}