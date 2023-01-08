import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, GuildMember, MessageActionRowComponentBuilder, TextChannel } from 'discord.js';
import { timeoutEmbed, timeoutState } from '../features';
import { guilds } from '../schema';

export const name = Events.GuildMemberUpdate,
once = false

export async function execute(before: GuildMember, after: GuildMember) {
	timeoutLog(before, after)
}

async function timeoutLog(before: GuildMember, after: GuildMember) {

	if(before.communicationDisabledUntil == after.communicationDisabledUntil) return;

	const config = await guilds.get(after.guild)

	if(!config?.timeoutlog.enabled) return;

	const channel = after.guild.channels.cache.find((channel) => channel.id == config.timeoutlog.channel) as TextChannel;
	if(!channel) return;
	let embed: EmbedBuilder
	
	const rows:ActionRowBuilder<MessageActionRowComponentBuilder>[] = []
	if(!before.isCommunicationDisabled() && after.isCommunicationDisabled()) {
		embed = await timeoutEmbed(after,timeoutState.start)
		rows.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents( new ButtonBuilder()
			.setCustomId(`endtimeout`)
			.setStyle(ButtonStyle.Danger)
			.setLabel('Remove Timeout')
			.setDisabled(true)))
	} else if(before.isCommunicationDisabled() && !after.isCommunicationDisabled()) {
		embed = await timeoutEmbed(after, timeoutState.end)
	} else if (after.communicationDisabledUntil == undefined) {
		return
	}
	} else return

	channel.send({embeds:[embed], components:rows})
}