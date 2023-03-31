import { bold, ChannelType, ColorResolvable, Colors, EmbedBuilder, Events, GuildMember, PermissionFlagsBits, VoiceChannel, VoiceState } from 'discord.js';
import Event from '../classes/Event';

export default new Event()
    .setName(Events.VoiceStateUpdate)
    .setOnce(false)
    .setExecute(execute);

async function execute(oldState:VoiceState, newState:VoiceState) {
    let channel:VoiceChannel;
    let embed:EmbedBuilder;
    // Leaves Channel
    if (newState.channelId == null && oldState.channel && oldState.channel.type == ChannelType.GuildVoice) {
        channel = oldState.channel;
        embed = vcEmbed(newState.member);
    }
    // Joins Channel
    else if (oldState.channelId == null && newState.channel && newState.channel.type == ChannelType.GuildVoice) {
        channel = newState.channel;
        embed = vcEmbed(newState.member, true);
    }
    else if (oldState.channelId == newState.channelId) {
        return;
    }
    // Moved Channel
    else if (oldState.channel.type == ChannelType.GuildVoice && newState.channel.type == ChannelType.GuildVoice) {
        newState.channel.send({ embeds:[ vcEmbed(newState.member, true)] }).catch((err) => {
            console.log(channel);
            console.error(err);
        });
        channel = oldState.channel;
        if (newState.channel.permissionsFor(newState.guild.roles.everyone).has(PermissionFlagsBits.ViewChannel)) {
            embed = new EmbedBuilder()
                .setAuthor({ iconURL: newState.member.displayAvatarURL({ forceStatic: true, size: 1024 }), name:newState.member.user.tag })
                .setDescription(bold(`Member moved to ${newState.channel}`))
                .setColor(Colors.Yellow)
                .setTimestamp();
        }
        else {

            embed = vcEmbed(newState.member);

        }


    }
    if (channel && embed) {
        channel.send({ embeds:[embed] }).catch((err) => {
            console.log(channel);
            console.error(err);
        });
    }
}

function vcEmbed(member:GuildMember, joined = false) {
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