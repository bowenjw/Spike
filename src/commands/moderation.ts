import { ActionRowBuilder, ChannelType, ChatInputCommandInteraction, GuildMember, MessageActionRowComponentBuilder, PermissionsBitField, SlashCommandBuilder, SlashCommandSubcommandBuilder, UserSelectMenuBuilder, VoiceChannel } from "discord.js";

const moveCommand = new SlashCommandSubcommandBuilder()
    .setName('move')
    .setDescription('Moves members from one VC to another')
    .addChannelOption(option => option
        .setName("destination")
        .setDescription("Channel where members will be move to")
        .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
        .setRequired(true))
    .addBooleanOption(option => option
        .setName('everyone')
        .setDescription('Do you want to move everyone in the VC')
        .setRequired(false)),

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
            { name: '60 secs', value: 60 },
            { name: '5 mins', value: 300 },
            { name: '10 mins', value: 600 },
            { name: '30 mins', value: 1800 },
            { name: '1 hour', value: 3600 },
            { name: '2 hours', value: 7200 },
            { name: '6 hours', value: 21600 },
            { name: '12 hours', value: 43200 },
            { name: '1 Day', value: 86400 },
            { name: '3 Days', value: 259200 },
            { name: '1 week', value: 604800 }))
    .addStringOption(option => option
        .setName('reason')
        .setDescription('The reason for timing them out'))
            
export const slashCommandBuilder = new SlashCommandBuilder()
    .setName('moderation')
    .setDescription('Moderation Commands')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
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
    if(source == null) {
        interaction.reply({content:"You must be in a Voice Channel to use this command", ephemeral: true})
        return;
    } else if(source.id == destination.id) {
        interaction.reply({content:`Members are already in ${destination}`, ephemeral: true})
        return;
    } else if(interaction.options.getBoolean('everyone')) {
        source.members.forEach(async member => member.voice.setChannel(destination));
        interaction.reply({content:'Members have been moved', ephemeral:true})
        return;
    }
    //interaction.deferReply({ephemeral: true});
    const usermenu = new UserSelectMenuBuilder()
        .setCustomId(`usermove ${destination.id} ${source.id}`)
        .setPlaceholder('Select users')
        .setMaxValues(8)
        .setMinValues(2),
  
    topActionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(usermenu)
    
    interaction.reply({content:'Select users you would like to move', components:[topActionRow], ephemeral:true})
}

async function timeoutFunction(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getMember('user') as GuildMember,
    reason = interaction.options.getString('reason') || 'No Reason given',
    duration = interaction.options.getNumber('durations', true),
    endedDate = Math.floor(new Date().getTime()/1000) + duration

    user.timeout(duration*1000, reason)

    interaction.reply({content:`${user} has been timed out until <t:${endedDate}:F>`, ephemeral:true})
}