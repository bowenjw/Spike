import { 
    ChannelType, 
    ChatInputCommandInteraction, 
    PermissionFlagsBits, 
    SlashCommandBooleanOption, 
    SlashCommandBuilder, 
    SlashCommandChannelOption, 
    SlashCommandIntegerOption, 
    SlashCommandSubcommandBuilder, 
    TextChannel 
} from "discord.js";
import { guildDB } from "../../util/schema/guilds";

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
        channel = interaction.options.getChannel('channel') as TextChannel | null,
        record = await guildDB.get(interaction.guild!)
        if(!record)
            return;
        if(enable == null && channel == null) {
            interaction.reply({content: 'No changes made to selected system', ephemeral: true});
            return;
        }
        guildDB.setFeture(record,interaction.options.getInteger('system', true), enable, channel)
        
        interaction.reply({content:'System configerations updated', ephemeral: true})
    }
}
