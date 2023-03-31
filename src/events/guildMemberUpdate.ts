import { ActionRowBuilder, ButtonBuilder, Colors, Events, GuildMember, TextChannel } from 'discord.js';
import Event from '../classes/Event';
import { moderateUserButton, userEmbed } from '../features/inspect';

const welcomeChannelID = process.env.USER_WELCOME_CHANNEL_ID;

export default new Event()
    .setName(Events.GuildMemberUpdate)
    .setOnce(false)
    .setExecute(execute);

async function execute(oldMember:GuildMember, newMember:GuildMember) {
    if (oldMember.pending && !newMember.pending) {
        const channel = oldMember.guild.channels.cache.find((_c, k) => k == welcomeChannelID) as TextChannel;
        channel.send({
            embeds: [(await userEmbed(newMember, Colors.Green))
                .addFields({ name: 'More Info:', value:`${newMember}` })],
            components: [new ActionRowBuilder<ButtonBuilder>()
                .addComponents(moderateUserButton(newMember.user))],
        });
    }
}