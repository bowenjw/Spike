import { AuditLogEvent, EmbedBuilder, Events, GuildMember, TextChannel } from 'discord.js';
export const name = Events.GuildMemberUpdate,
once = false
export {memberUpdate as execute}
async function memberUpdate(oldMember: GuildMember, newMember: GuildMember) {
	const guild = newMember.guild,
		logChannel = await guild.channels.fetch('970498463953453179') as TextChannel,
		entry = (await guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.MemberDisconnect || AuditLogEvent.MemberUpdate})).entries.first()!,
		executor = await guild.members.fetch(entry.executor?.id!);

	let embed = new EmbedBuilder()
			.setFooter({text: `Action by ${executor.displayName}`, iconURL: executor.displayAvatarURL() })
			.setThumbnail(newMember.displayAvatarURL())
			.setColor('#fffa77')
			.setTimestamp();
	// console.log(entry)

	if(!oldMember.communicationDisabledUntilTimestamp && newMember.communicationDisabledUntilTimestamp){
		const endedDate = Math.floor(newMember.communicationDisabledUntil!.getTime()/1000)
		embed = embed.setTitle('Timeout')
		.setDescription(`Member ${newMember}(${newMember.displayName}) has been timed out`)
		.addFields(
			{name: 'Reason', value: entry.reason!, inline: false},
			{name: 'Timed Out Until', value: `<t:${endedDate}:R>\n <t:${endedDate}:F>`})
		logChannel.send({embeds: [embed]})
	}
	else if(oldMember.communicationDisabledUntilTimestamp && !newMember.communicationDisabledUntilTimestamp){
		embed = embed.setTitle('Timeout Ended Early')
			.setDescription(`Member ${newMember} had their timeout ended early`)
		logChannel.send({embeds: [embed]})
	}
}