import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandSubcommandBuilder, TextChannel } from "discord.js";
import { Document, Types } from "mongoose";
import { config } from "../../util/database";
import { guilds, IGuild } from "../../util/schema/guilds";




const systemSelect = new SlashCommandIntegerOption()
    .setName('system')
    .setDescription('sub function to modify')
    .setRequired(true)
    .addChoices(
        { name: 'Timeout Log', value: 0 },
        { name: 'Warn', value: 1 }
    ),
systemEnable = new SlashCommandBooleanOption()
        .setName('enable')
        .setDescription('Leave empty to not modifiy system state'),

channelSelect = new SlashCommandChannelOption()
        .setName('channel')
        .setDescription('channel to set as log for system')
        .addChannelTypes(ChannelType.GuildText),

system = new SlashCommandSubcommandBuilder()
    .setName('system')
    .setDescription('modify spific feture')
    .addIntegerOption(systemSelect)
    .addBooleanOption(systemEnable)
    .addChannelOption(channelSelect)


export const slashCommandBuilder = new SlashCommandBuilder()
    .setName('config')
    .setDescription('config command')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand(system)

export async function commandExecute(interaction: ChatInputCommandInteraction) {
    const subcommandGroup = interaction.options.getSubcommandGroup(),
    subcommand = interaction.options.getSubcommand(true)
    
    if(subcommand == 'system') {
        const enable = interaction.options.getBoolean('enable'),
        channel = interaction.options.getChannel('channel'),
        record = await config.get(interaction.guildId!)
        if(!record)
            return;
        if(enable == null && !channel) {
            interaction.reply({content: 'No changes made to selected system', ephemeral: true});
            return;
        }
        switch (interaction.options.getInteger('system', true)) {
            case 0:
                timeout(record, enable, channel as TextChannel)
                break;
            case 1:
                warn(record, enable, channel as TextChannel)
                break;
            default:
                break;
        }
        interaction.reply({content:'System configerations updated', ephemeral: true})
    }
}

function timeout(
    record: (Document<unknown, any, IGuild> & IGuild & {_id: Types.ObjectId; }),
    enable: boolean | null, 
    channel: TextChannel | null) {
        
    if(enable)
        record.TimeoutLog.enabled = enable;
    if(channel)
        record.TimeoutLog.channel = channel.id;
    record.save()
}

function warn(
    record: (Document<unknown, any, IGuild> & IGuild & {_id: Types.ObjectId; }),
    enable: boolean | null,
    channel: TextChannel | null) {
        
    if(enable)
        record.warnSystem.enabled = enable;
    if(channel)
        record.warnSystem.channel = channel.id;
    record.save()
}
