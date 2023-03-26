import { bold, ChannelType, ColorResolvable, Colors, EmbedBuilder, Events, GuildMember, VoiceState } from 'discord.js';
import Event from '../classes/Event';

export default new Event()
    .setName(Events.VoiceStateUpdate)
    .setOnce(false)
    .setExecute(execute);

async function execute(oldState:VoiceState, newState:VoiceState) {
    // Leaves Channel
    if (newState.channelId == null && oldState.channel.type == ChannelType.GuildVoice) {
        oldState.channel.send({ embeds: [await vcEmbed(newState.member)] });
    }
    // Joins Channel
    else if (oldState.channelId == null && newState.channel.type == ChannelType.GuildVoice) {
        newState.channel.send({ embeds: [await vcEmbed(newState.member, true)] });
    }
}

async function vcEmbed(member:GuildMember, joined = false) {
    let message:string = bold('Member left voice channel');
    let color:ColorResolvable = Colors.Red;
    if (joined) {
        message = bold('Member joined voice channel');
        color = Colors.Green;
    }
    return new EmbedBuilder()
        .setAuthor({ iconURL: member.displayAvatarURL({ forceStatic: true, size: 1024 }), name:member.user.tag })
        .setDescription(message)
        .setColor(color)
        .setTimestamp();
}