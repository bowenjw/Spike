import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, GuildMember, MessageActionRowComponentBuilder, TextChannel } from 'discord.js';
import { timeoutEmbed, timeoutState } from '../features';
import { Event } from '../interfaces';
import { guilds } from '../schema';

const event:Event = {
    name:Events.GuildMemberUpdate,
    once: false,
    execute:(_client, before: GuildMember, after: GuildMember) => {
        timeoutLog(before, after);
    },
};

async function timeoutLog(before: GuildMember, after: GuildMember) {

    if (before.communicationDisabledUntil == after.communicationDisabledUntil) return;

    const config = await guilds.get(after.guild);

    if (!config?.timeoutlog.enabled) return;

    const channel = after.guild.channels.cache.find((c) => c.id == config.timeoutlog.channel) as TextChannel;
    if (!channel) return;
    let embed: EmbedBuilder;

    const rows:ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
    if (!before.isCommunicationDisabled() && after.isCommunicationDisabled()) {
        embed = await timeoutEmbed(after, timeoutState.start);
        rows.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(new ButtonBuilder()
            .setCustomId('endtimeout')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Remove Timeout')
            .setDisabled(true)));
    }
    else if (before.isCommunicationDisabled() && !after.isCommunicationDisabled()) {
        embed = await timeoutEmbed(after, timeoutState.end);
    }
    else if (after.communicationDisabledUntil == undefined) {
        return;
    }
    else if (before.communicationDisabledUntil != after.communicationDisabledUntil) {
        embed = await timeoutEmbed(after, timeoutState.update);
        rows.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(new ButtonBuilder()
            .setCustomId('endtimeout')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Remove Timeout')
            .setDisabled(true)));
    }
    else {
        return;
    }

    channel.send({ embeds:[embed], components:rows });
}

export default event;