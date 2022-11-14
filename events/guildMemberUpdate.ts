import { AuditLogEvent, EmbedBuilder, Events, GuildMember, TextChannel, time, User } from 'discord.js';
import { config } from '../util/database'
export const name = Events.GuildMemberUpdate,
once = false

export async function execute(oldMember: GuildMember, newMember: GuildMember) {
	const memberTimedout = !oldMember.isCommunicationDisabled() && newMember.isCommunicationDisabled(),
	memberTimeoutEnded = oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled()

	if(memberTimedout || memberTimeoutEnded) {
		const guild = newMember.guild,
		timeoutLog = (await config.get(guild.id))?.TimeoutLog

		if(!timeoutLog?.enabled) {
			return;
		}

		const auditlog = await guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.MemberUpdate || AuditLogEvent.MemberDisconnect}),
		entry = auditlog.entries.first()!,
		executor = await guild.members.fetch(entry.executor?.id!);

		let embed = new EmbedBuilder()
			.setFooter({text: `Action by ${executor.displayName}`, iconURL: executor.displayAvatarURL() })
			.setThumbnail(newMember.avatarURL())
			.setColor('LuminousVividPink')
			.setTimestamp();
		
		if(memberTimedout) {
			const endedDate = Math.floor(newMember.communicationDisabledUntil!.getTime()/1000)
			let reason = entry.reason
			if(!reason)
				reason = "No reason Given"
			embed = embed.setTitle('Timeout')
			.setDescription(`Member ${newMember}(${newMember.displayName}) has been timed out`)
			.addFields(
				{name: 'Reason', value: reason, inline: false},
				{name: 'Timed Out Until', value: `<t:${endedDate}:R>\n <t:${endedDate}:F>`})
			
		} else if(memberTimeoutEnded) {
			embed = embed.setTitle('Timeout Ended Early')
			.setDescription(`Member ${newMember} had their timeout ended early`)
		}

		try {
			(guild.channels.cache.get(timeoutLog.channel) as TextChannel).send({embeds: [embed]})
		} catch (error) {
		}
	}
}