import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { ChatInputCommand } from '../../interfaces';
import { amputator } from '../../features';

const command:ChatInputCommand = {
    options: new SlashCommandBuilder()
        .setName('amputator')
        .setDescription('Get non AMP versions of websites')
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
        .addStringOption(option => option
            .setName('link')
            .setDescription('Link to AMPed webstie')
            .setRequired(true)),
    global: true,
    execute:amputator,
};

export default command;