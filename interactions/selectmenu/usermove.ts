import { AnySelectMenuInteraction, VoiceChannel } from "discord.js";

export const customid = 'usermove'
export function selectMenueInteractionExecute(interaction: AnySelectMenuInteraction){
    const destination = interaction.guild?.channels.cache.find(channel => channel.id === interaction.customId.split(' ')[1]) as VoiceChannel,
    source = interaction.guild?.channels.cache.find(channel => channel.id === interaction.customId.split(' ')[2]) as VoiceChannel,
    members = source.members.filter(member => interaction.values.includes(member.id))
    
    if(members.size < 2) {
        interaction.reply({content:'Two or more moveable Members need to be selected', ephemeral:true})
    }
    else {
        members.forEach(async member => member.voice.setChannel(destination));
        interaction.update({content:'Members have been moved', components:[]})
    }
}