import { APIApplicationCommandOptionChoice, ChannelType, ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandUserOption, VoiceChannel } from "discord.js";

const moveCommand = new SlashCommandSubcommandBuilder()
    .setName('move')
    .setDescription('Moves members from one VC to another')
    .addChannelOption(option => option
        .setName("destination")
        .setDescription("Channel where members will be move to")
        .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
        .setRequired(true)),

timeoutCommand = new SlashCommandSubcommandBuilder()
    .setName('timeout')
    .setDescription('Custom Timeout Command')
    .addUserOption(option => option
        .setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addNumberOption(option => option
        .setName('durations')
        .setDescription('How long they should be timed out for')
        .setRequired(true)
        .setChoices(
            { name: '30 mins', value: 1800 },
            { name: '1 hours', value: 3600 },
            { name: '2 hours', value: 7200 },
            { name: '6 hours', value: 21600 },
            { name: '12 hours', value: 43200 },
            { name: '1 Day', value: 86400 },
            { name: '3 Days', value: 259200 }))
    .addStringOption(option => option
        .setName('reason')
        .setDescription('The reason for timing them out'))
            
export const slashCommandBuilder = new SlashCommandBuilder()
    .setName('moderation')
    .setDescription('Moderation Commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(moveCommand)
    .addSubcommand(timeoutCommand)

export async function commandExecute(interaction: ChatInputCommandInteraction) {
 // console.log(interaction)
    switch (interaction.options.getSubcommand(true)) {
        case 'move':
            moveFunction(interaction)
            break;
        case 'timeout':
            timeoutFunction(interaction)
            break;
    
        default:
            interaction.reply({content:'Error', ephemeral:true})
            break;
    }
}
async function moveFunction(interaction: ChatInputCommandInteraction) {
    const source = (await interaction.guild!.members.fetch(interaction.user.id))?.voice.channel,
        destination = interaction.options.getChannel("destination", true) as VoiceChannel;
    let content = "You must be in a Voice Channel to use this command"
 // console.log(sourceChannel?.members)
    
    if (source != null) {
        source.members.forEach(async member => member.voice.setChannel(destination));
        content = `Users Moved have been moved to ${destination}`;
    }
    interaction.reply({content: content ,ephemeral: true});
}

async function timeoutFunction(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getMember('user') as GuildMember,
        reason = interaction.options.getString('reason') || 'No Reason given',
        duration = interaction.options.getNumber('durations', true)
    user.timeout(duration*1000, reason)
    const endedDate = Math.floor(new Date().getTime()/1000) + duration
    interaction.reply({content:`${user} has been timed out until <t:${endedDate}:F>`, ephemeral:true})
}