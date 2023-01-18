import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, Message, MessageActionRowComponentBuilder, TextChannel, ThreadChannel } from 'discord.js';
import { Event } from '../interfaces';

// eslint-disable-next-line no-useless-escape
const messageReExp = /(https:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{0,256}\.?discord\.com\/channels\/[0-9]{0,22}\/[0-9]{0,22}\/[0-9]{0,22}/gim;

const event: Event = {
    name: Events.MessageCreate,
    once: false,
    execute: async (client, message: Message) => {


        if (message.author.bot || !message.inGuild()) { return; }
        let match: RegExpExecArray | null;

        while ((match = messageReExp.exec(message.content)) != null) {
            const linkedMessageIds = match[0].split('discord.com/channels/')[1].split('/');
            if (linkedMessageIds[0] != message.guildId) { continue; }
            const linkedMessage = await (await message.guild.channels.fetch(linkedMessageIds[1]) as ThreadChannel | TextChannel)
                    .messages.fetch(linkedMessageIds[2]),
                linkedMembor = await message.guild.members.fetch(linkedMessage.author.id),
                embed = new EmbedBuilder()
                    .setAuthor({ name:`${linkedMembor.displayName}`, iconURL:linkedMessage.author.displayAvatarURL({ forceStatic:true }) })
                    .setColor(client.config.colors.embed)
                    .setTimestamp(linkedMessage.createdAt),
                row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(new ButtonBuilder()
                        .setURL(`discord://discord.com/channels/${linkedMessageIds[0]}/${linkedMessageIds[1]}/${linkedMessageIds[2]}`)
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Jump to Message')),
                image = linkedMessage.attachments.find((a) => a.contentType && ['image/png', 'image/jpeg', 'image/gif'].includes(a.contentType));
            // console.log(linkedMessage.attachments)
            if (image) {
                embed.setImage(image.url);
            }
            if (linkedMessage.content) {
                embed.setDescription(linkedMessage.content);
            }
            await message.reply({ content:`Message from ${linkedMessage.channel}`, embeds:[embed], components:[row], allowedMentions:{ repliedUser:false } }).catch(console.log);
        }


    },
};

export default event;