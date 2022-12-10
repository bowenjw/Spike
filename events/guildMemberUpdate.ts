import { Events, GuildMember } from 'discord.js';
import { getTimeoutLogChannel, timeoutLogMessage } from '../util/system/Timeoutlog';
export const name = Events.GuildMemberUpdate,
once = false

export async function execute(before: GuildMember, after: GuildMember) {

	if(!before.isCommunicationDisabled() && after.isCommunicationDisabled()) {
		
		const logChannel = await getTimeoutLogChannel(after.guild)
		
		if(logChannel != undefined) {
			timeoutLogMessage(after.guild, after, logChannel, false)
		}
		
	} else if(before.isCommunicationDisabled() && !after.isCommunicationDisabled()) {
		
		const logChannel = await getTimeoutLogChannel(after.guild)
		if(logChannel != undefined) {
			timeoutLogMessage(after.guild, after, logChannel, true)
		}
	}
	
}