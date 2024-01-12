import { PermissionsBitField, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandSubcommandBuilder, SlashCommandUserOption } from 'discord.js';

const userOption = new SlashCommandUserOption()
        .setName('target')
        .setDescription('User')
        .setRequired(true),

    warnRemove = new SlashCommandSubcommandBuilder()
        .setName('remove')
        .setDescription('Remove warning from user')
        .addStringOption(option => option
            .setName('id')
            .setDescription('The Id number for the warn')
            .setMaxLength(24)
            .setMinLength(24)
            .setRequired(true))
        .addBooleanOption(option => option
            .setName('delete')
            .setDescription('Permanently delete warning from record')),

    warnView = new SlashCommandSubcommandBuilder()
        .setName('view')
        .setDescription('See warns of a user')
        .addUserOption(userOption)
        .addIntegerOption(option => option
            .setName('scope')
            .setDescription('scope of warning history')
            .addChoices(
                { name: 'All', value: 0 },
                { name: '3 Months', value: 3 },
                { name: '6 Months', value: 6 },
                { name: '9 Months', value: 9 },
                { name: '1 year', value: 12 }))
        .addBooleanOption(option => option
            .setName('show')
            .setDescription('Show the view warns in the channel')),
    duration = new SlashCommandIntegerOption()
        .setName('duration')
        .setDescription('Number of days, the warning till end of the warn')
        .setMinValue(0),
    warnAdd = new SlashCommandSubcommandBuilder()
        .setName('add')
        .setDescription('Warn a user')
        .addUserOption(userOption)
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason why member is warned')
            .setMaxLength(400))
        .addIntegerOption(duration);

export const slashCommandBuilder = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn Command')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addSubcommand(warnRemove)
    .addSubcommand(warnView)
    .addSubcommand(warnAdd);
