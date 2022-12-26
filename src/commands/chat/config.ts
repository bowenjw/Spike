import { ChannelType, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, TextChannel } from "discord.js";
import { guilds } from "../../schema";


const active = new SlashCommandBooleanOption()
    .setName('active')
    .setDescription('Define the state of this feature')
    .setRequired(false),

channel = new SlashCommandChannelOption()
    .setName('channel')
    .setDescription('Channel to set as log for system')
    .addChannelTypes(ChannelType.GuildText)


export const builder = new SlashCommandBuilder()
    .setName('config')
    .setDescription('config command')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .setDMPermission(false)
    .addSubcommand(subcommand => subcommand
        .setName('timeoutlog')
        .setDescription('Set configeration for timeout log')
        .addBooleanOption(active)
        .addChannelOption(channel))
    .addSubcommand(subcommand => subcommand
        .setName('warning')
        .setDescription('Set configeration for warning system')
        .addBooleanOption(active)
        .addChannelOption(channel)
        .addStringOption(option => option
            .setName('message')
            .setDescription('Set a message given to members when banned')
            .setMaxLength(400))
        .addIntegerOption(option => option
            .setName('maxwarns')
            .setDescription('set to 0 to disable autoban')
            .setMinValue(0))),
global = true

export async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand(true)
    switch (subcommand) {
        case 'warning':
            warning(interaction)
            break;
        case 'timeoutlog':
            timeoutLog(interaction)
            break;
        default:
            interaction.reply({content:'Error', ephemeral:true})
            break;
    }
}


async function warning(interaction: ChatInputCommandInteraction) {
    const status = interaction.options.getBoolean('active'),
    channel = interaction.options.getChannel('channel') as TextChannel | null,
    max = interaction.options.getInteger('maxwarns'),
    message = interaction.options.getString('message')

    if(!(status != null || channel || max != null || message)) {
        interaction.reply({content:'No changes made to warning system', ephemeral:true})
        return
    }
    let update:any = new Object()

    if(status != null) update['warning.enabled'] = status
    if(channel) update['warning.channel'] = channel.id
    if(max != null) update['warning.maxActiveWarns'] = max
    if(message) update['warning.appealMessage'] = message

    await guilds.DB.findOneAndUpdate({id:interaction.guildId!},{$set:update})

    interaction.reply({content:'Warning System has been updated', ephemeral:true})

}
async function timeoutLog(interaction: ChatInputCommandInteraction) {
    const status = interaction.options.getBoolean('active'),
    channel = interaction.options.getChannel('channel') as TextChannel | null

    if(!(status != null || channel)) {
        interaction.reply({content:'No changes made to warning system', ephemeral:true})
        return
    }
    let update:any = new Object()

    if(status != null) update["timeoutlog.enabled"] = status
    if(channel) update["timeoutlog.channel"] = channel.id

    await guilds.DB.findOneAndUpdate({id:interaction.guildId!}, { $set: update})

    interaction.reply({content:'Timeout log has been updated', ephemeral:true})

}

