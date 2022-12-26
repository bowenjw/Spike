import { PermissionsBitField, SlashCommandBuilder } from "discord.js";

export { amputator as execute } from "../../features";

export const builder = new SlashCommandBuilder()
    .setName('amputator')
    .setDescription('Get non AMP versions of websites')
    .setDMPermission(true)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
    .addStringOption(option => option
        .setName("link")
        .setDescription("Link to AMPed webstie")
        .setRequired(true)),
global = true
