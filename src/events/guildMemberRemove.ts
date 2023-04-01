import { AuditLogEvent, Colors, EmbedBuilder, Events, GuildMember, ThreadChannel } from 'discord.js';
import Event from '../classes/Event';

const channelID = process.env.USER_WELCOME_CHANNEL_ID;

export default new Event()
    .setName(Events.GuildMemberRemove)
    .setExecute(execute);

async function execute(member:GuildMember) {
    const auditLog = (await member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick || AuditLogEvent.MemberBanAdd, limit:10 })).entries
        .filter(e => e.targetId == member.id);
    if (auditLog.size > 0) return;
    const avatarURL = member.user.avatarURL({ forceStatic: true });
    const channel = member.guild.channels.cache.find((_c, k) => k == channelID) as ThreadChannel;
    channel.send({
        embeds:[
            new EmbedBuilder()
                .setAuthor({ name: member.user.tag, iconURL: avatarURL })
                .setTitle('User left')
                .setThumbnail(avatarURL)
                .setColor(Colors.Yellow)
                .setTimestamp(),
        ],
    });
}