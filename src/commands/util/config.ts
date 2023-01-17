/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChannelType, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, TextChannel } from 'discord.js';
import { ChatInputCommand } from '../../interfaces';
import { guilds } from '../../schema';


const active = new SlashCommandBooleanOption()
        .setName('active')
        .setDescription('Define the state of this feature')
        .setRequired(false),

    channelOption = new SlashCommandChannelOption()
        .setName('channel')
        .setDescription('Channel to set as log for system')
        .addChannelTypes(ChannelType.GuildText),

    command:ChatInputCommand = {
        options: new SlashCommandBuilder()
            .setName('config')
            .setDescription('config command')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
            .setDMPermission(false)
            .addSubcommand(subcommand => subcommand
                .setName('timeoutlog')
                .setDescription('Set configeration for timeout log')
                .addBooleanOption(active)
                .addChannelOption(channelOption))
            .addSubcommand(subcommand => subcommand
                .setName('warning')
                .setDescription('Set configeration for warning system')
                .addBooleanOption(active)
                .addChannelOption(channelOption)
                .addStringOption(option => option
                    .setName('message')
                    .setDescription('Set a message given to members when banned')
                    .setMaxLength(400))
                .addIntegerOption(option => option
                    .setName('maxwarns')
                    .setDescription('set to 0 to disable autoban')
                    .setMinValue(0))),
        global: true,
        execute:(_client, interaction) => {
            const subcommand = interaction.options.getSubcommand(true);
            switch (subcommand) {
            case 'warning':
                warning(interaction);
                break;
            case 'timeoutlog':
                timeoutLog(interaction);
                break;
            default:
                interaction.reply({ content:'Error', ephemeral:true });
                break;
            }
        },
    };

export default command;

async function warning(interaction: ChatInputCommandInteraction) {
    const status = interaction.options.getBoolean('active'),
        channel = interaction.options.getChannel('channel') as TextChannel | null,
        max = interaction.options.getInteger('maxwarns'),
        message = interaction.options.getString('message');

    if (!(status != null || channel || max != null || message)) {
        interaction.reply({ content:'No changes made to warning system', ephemeral:true });
        return;
    }
    const update:any = new Object();

    if (status != null) update['warning.enabled'] = status;
    if (channel) update['warning.channel'] = channel.id;
    if (max != null) update['warning.maxActiveWarns'] = max;
    if (message) update['warning.appealMessage'] = message;

    await guilds.DB.findOneAndUpdate({ id:interaction.guildId! }, { $set:update });

    interaction.reply({ content:'Warning System has been updated', ephemeral:true });

}
async function timeoutLog(interaction: ChatInputCommandInteraction) {
    const status = interaction.options.getBoolean('active'),
        channel = interaction.options.getChannel('channel') as TextChannel | null;

    if (!(status != null || channel)) {
        interaction.reply({ content:'No changes made to warning system', ephemeral:true });
        return;
    }
    const update:any = new Object();

    if (status != null) update['timeoutlog.enabled'] = status;
    if (channel) update['timeoutlog.channel'] = channel.id;

    await guilds.DB.findOneAndUpdate({ id:interaction.guildId! }, { $set: update });

    interaction.reply({ content:'Timeout log has been updated', ephemeral:true });

}

