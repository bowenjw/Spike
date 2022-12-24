import { AuditLogEvent, EmbedBuilder, Guild, GuildMember, TextChannel } from "discord.js";
import { guildDB } from "../../util/schema/guilds";

export async function timeoutLogMessage(guild:Guild, after: GuildMember, logChannel:TextChannel, timeoutEnded:boolean, ) {
    const auditlog = await guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.MemberUpdate || AuditLogEvent.MemberDisconnect}),
		entry = auditlog.entries.first()!,
		executor = await guild.members.fetch(entry.executor?.id!);

		let embed = new EmbedBuilder()
			.setFooter({text: `Action by ${executor.displayName}`, iconURL: executor.displayAvatarURL() })
			.setThumbnail(after.avatarURL())
			.setColor('LuminousVividPink')
			.setTimestamp();
		
		if(!timeoutEnded) {
			const endedDate = Math.floor(after.communicationDisabledUntil!.getTime()/1000)
			let reason = entry.reason
			if(!reason)
				reason = "No reason Given"
        
			embed = embed.setTitle('Timeout')
			.setDescription(`Member ${after}(${after.displayName}) has been timed out`)
			.addFields(
				{name: 'Reason', value: reason, inline: false},
				{name: 'Timed Out Until', value: `<t:${endedDate}:R>\n <t:${endedDate}:F>`})
			
		} else{
			embed = embed.setTitle('Timeout Ended Early')
			.setDescription(`Member ${after} had their timeout ended early`)
		}
        logChannel.send({embeds: [embed]}).catch(err => console.log(err))
}

export async function getTimeoutLogChannel(guild:Guild) {
	const timeoutLog = (await guildDB.get(guild))?.timeoutlog
	console.log(timeoutLog)
	if(!timeoutLog?.enabled) {
		return undefined;
	} else {
		return guild.channels.cache.get(timeoutLog.channel!) as TextChannel
	}
}