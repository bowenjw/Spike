import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types";
import { getReportModal } from "../../system/report";
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
        .setRequired(true))


const command:Command = {
    name: builder.name,
    description: builder.description,
    commandBuilder: builder,
    execute: getReportModal
}
function test(interaction:ChatInputCommandInteraction) {
    console.log(typeof interaction)
}
export = command;