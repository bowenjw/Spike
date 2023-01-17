/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AuditLogEvent, EmbedBuilder, Guild, GuildMember, TextChannel } from 'discord.js';
import { guilds } from '../schema';

// eslint-disable-next-line no-shadow
export enum timeoutState {
	start = 0,
	end = 1,
	update = 2
}
export async function timeoutEmbed(after: GuildMember, state:timeoutState) {

    const guild = after.guild,
        auditlog = (await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberUpdate || AuditLogEvent.MemberDisconnect || AuditLogEvent.AutoModerationUserCommunicationDisabled })).entries.first()!,
        executor = await guild.members.fetch(auditlog.executor?.id!);

    const embed = new EmbedBuilder()
            .setTitle('Timeout')
            .setFooter({ text: `Action by ${executor.displayName}`, iconURL: executor.displayAvatarURL({ forceStatic:true }) })
            .setThumbnail(after.avatarURL({ forceStatic:true }) || after.user.avatarURL({ forceStatic:true }))
            .setColor('LuminousVividPink')
            .setTimestamp(),
        endedDate = Math.floor(after.communicationDisabledUntil!.getTime() / 1000);
    let reason = auditlog.reason;
    switch (state) {
    case timeoutState.update:
        embed.setTitle('Timeout | Updated');
    // eslint-disable-next-line no-fallthrough
    case timeoutState.start:
        if (!reason) {reason = 'No reason Given';}

        embed.setDescription(`Member ${after}(${after.displayName}) has been timed out`)
            .addFields(
                { name: 'Reason', value: reason, inline: false },
                { name: 'Timed Out Until', value: `<t:${endedDate}:R>\n <t:${endedDate}:F>` });
        break;
    case timeoutState.end:
        embed.setTitle('Timeout | Ended Early')
            .setDescription(`Member ${after} had their timeout ended early`);
        break;
    default:
        break;
    }
    return embed;
}

export async function getTimeoutLogChannel(guild:Guild) {
    const timeoutLog = (await guilds.get(guild))?.timeoutlog;
    console.log(timeoutLog);
    if (!timeoutLog?.enabled) {
        return undefined;
    }
    else {
        return guild.channels.cache.get(timeoutLog.channel!) as TextChannel;
    }
}