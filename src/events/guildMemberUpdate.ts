import { EmbedBuilder, Events, GuildMember, TextChannel } from 'discord.js';
import { timeoutEmbed } from '../features';
import { Ievent } from '../interfaces';
import { guilds } from '../schema';

const event:Ievent = {
	name: Events.GuildMemberUpdate,
	once: false,
	execute:execute
}
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
	if(!before.isCommunicationDisabled() && after.isCommunicationDisabled()) {
		embed = await timeoutEmbed(after, true)
	} else if(before.isCommunicationDisabled() && !after.isCommunicationDisabled()) {
		embed = await timeoutEmbed(after)
	} else {
		embed = await timeoutEmbed(after)
	}

	channel.send({embeds:[embed]})
}