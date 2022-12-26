import { ChatInputCommandInteraction, VoiceChannel, UserSelectMenuBuilder, ActionRowBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder, ChannelType, PermissionsBitField } from "discord.js";
import { Icommand, Iinteraction } from "../../interfaces";

export const builder = new SlashCommandBuilder()
    .setName('move')
    .setDescription('Moves members from one VC to another')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers)
    .addChannelOption(option => option
        .setName("destination")
        .setDescription("Channel where members will be move to")
        .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
        .setRequired(true))
    .addBooleanOption(option => option
        .setName('everyone')
        .setDescription('Do you want to move everyone in the VC')
        .setRequired(false)),
global = true

export async function execute(interaction: ChatInputCommandInteraction) {
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