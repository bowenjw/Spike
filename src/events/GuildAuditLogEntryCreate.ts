import { AuditLogEvent, Colors, EmbedBuilder, Events, Guild, GuildAuditLogsEntry, User } from 'discord.js';
import { Event, TimeStyles } from '../Client';
import { guildsModel } from '../systems/guild';

export default new Event()
    .setName(Events.GuildAuditLogEntryCreate)
    .setExecute(execute);

async function execute(auditLogEntry:GuildAuditLogsEntry, guild:Guild) {
    const config = await guildsModel.getGuild(guild);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { executor, target, changes } = auditLogEntry;
    // console.log(auditLogEntry);
    // if (auditLogEntry.action == AuditLogEvent.MemberBanAdd && (target instanceof User)) {
    //     const avatarURL = target.avatarURL({ forceStatic: true });
    //     // console.log(auditLogEntry);
    //     config.send({
    //         embeds:[
    //             new EmbedBuilder()
    //                 .setAuthor({ name: target.tag, iconURL: avatarURL })
    //                 .setTitle('Member Banned')
    //                 .setFields(
    //                     { name: 'Banned By', value: `<@${auditLogEntry.executorId}>`, inline: true },
    //                     { name: 'Reason', value: auditLogEntry.reason, inline: true },
    //                 )
    //                 .setThumbnail(avatarURL)
    //                 .setColor(Colors.Red)
    //                 .setTimestamp(auditLogEntry.createdAt),
    //         ],
    //     });
    // }
    // else
    // if (auditLogEntry.action == AuditLogEvent.MemberKick && (target instanceof User)) {
    //     const avatarURL = target.avatarURL({ forceStatic: true });
    //     LeaveChannel.send({
    //         embeds:[
    //             new EmbedBuilder()
    //                 .setAuthor({ name: target.tag, iconURL: avatarURL })
    //                 .setTitle('Member Kicked')
    //                 .setFields(
    //                     { name: 'Kicked By', value: `<@${auditLogEntry.executorId}>`, inline: true },
    //                     { name: 'Reason', value: auditLogEntry.reason, inline: true },
    //                 )
    //                 .setThumbnail(avatarURL)
    //                 .setColor(Colors.Red)
    //                 .setTimestamp(auditLogEntry.createdAt),
    //         ],
    //     });
    // }
    // else
    if (config.timeout.enabled
        && auditLogEntry.action == AuditLogEvent.MemberUpdate
        && changes[0].key == 'communication_disabled_until'
        && (target instanceof User)
        // && auditLogEntry.executorId != guild.client.user.id
    ) {
        const timeoutChannel = config.timeout.channel;
        const avatarURL = target.avatarURL({ forceStatic: true });

        const newDate = changes[0].new ? new Date((changes[0].new as string)) : undefined;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const oldDate = changes[0].old ? new Date((changes[0].old as string)) : undefined;
        const title = 'Member Timed Out';
        const color = Colors.LuminousVividPink;
        const reason = auditLogEntry.reason || 'No Reason Given';
        // console.log(auditLogEntry, newDate, oldDate);
        timeoutChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: target.tag, iconURL: avatarURL })
                    .setTitle(title)
                    .addFields(
                        { name: 'Action By', value: `<@${auditLogEntry.executorId}>`, inline: true },
                        { name: 'Expires At', value: `${newDate.toDiscordString(TimeStyles.LongDateTime)}\n ${newDate.toDiscordString(TimeStyles.RelativeTime)}`, inline: true },
                        { name: 'Reason', value: reason },
                    )
                    .setColor(color)
                    .setThumbnail(avatarURL)
                    .setTimestamp(auditLogEntry.createdAt),
            ],
        });
    }
}
