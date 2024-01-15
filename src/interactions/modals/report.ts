import { ActionRowBuilder, bold, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, Message, MessageCreateOptions, ModalSubmitInteraction, Snowflake, TextChannel, ThreadChannel } from 'discord.js';
import { Interaction, TimeStyles } from '../../Client';

const reportChannelID = process.env.REPORT_CHANNEL_ID;

export default new Interaction<ModalSubmitInteraction>()
    .setName('report')
    .setExecute(execute);


async function execute(interaction:ModalSubmitInteraction) {
    interaction.reply({ content: 'Your report has been recived and will be reviewed', ephemeral: true });
    const { guild, customId, client } = interaction;
    const channel = guild.channels.cache.find((_c, k) => k == reportChannelID) as ThreadChannel;
    const args = customId.split(client.splitCustomIDOn);
    let message:MessageCreateOptions = { content: bold('Error') };
    switch (args[1]) {
    case 'm':
        message = await MessageReport(interaction, args);
        break;
    case 'u':
        message = userReport(interaction, args);
        break;
    default:
        break;
    }
    channel.send(message);
}


function userReport(interaction:ModalSubmitInteraction, args: string[]):MessageCreateOptions {
    const { guild, fields, member } = interaction;
    const tMember = guild.members.cache.find((_m, k) => k == args[2]);
    const comment = fields.getTextInputValue('comment') || 'No Additional Comment';
    const embed = new EmbedBuilder()
        .setTitle('User Report')
        .setThumbnail(tMember.displayAvatarURL({ forceStatic: true, size: 4096 }))
        .addFields(
            { name: 'Reported', value: `${tMember}`, inline: true },
            { name: 'Reported By', value: `${member}`, inline: true },
            { name: 'Comment', value: comment })
        .setColor(Colors.Red);
    return { embeds: [embed], components: [reportRow(args[2])] };
}

async function MessageReport(interaction:ModalSubmitInteraction, args: string[]):Promise<MessageCreateOptions> {
    const { guild, fields, member } = interaction;
    const channel = guild.channels.cache.find((_m, k) => k == args[2]) as TextChannel;
    const message = channel.messages.cache.find((_m, k) => k == args[3]);
    const tmember = await guild.members.fetch(message.author.id);
    const comment = fields.getTextInputValue('comment') || 'No Additional Comment';
    const embed = new EmbedBuilder()
        .setTitle('Message Report')
        .setThumbnail(tmember.displayAvatarURL({ forceStatic: true, size: 1024 }) || tmember.user.avatarURL({ forceStatic: true, size: 1024 }))
        .addFields(
            { name: 'Channel', value: `${channel}`, inline: true },
            { name: 'Date Posted', value: message.createdAt.toDiscordString(TimeStyles.LongDateTime), inline: true },
            { name: 'Content of Message', value: message.content },
            { name: 'Reported', value: `${tmember}`, inline: true },
            { name: 'Reported By', value: `${member}`, inline: true },
            { name: 'Comment', value: comment })
        .setColor(Colors.Red);
    return { embeds: [embed], components: [reportRow(message.author.id, message)] };
}

function reportRow(id:Snowflake, message?:Message) {
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(instpct.setCustomId(`inspect_${id}`));
    if (message) {
        return row.addComponents(link.setURL(message.url));
    }
    else {
        return row;
    }
}

const instpct = new ButtonBuilder()
    .setLabel('Inspect User')
    .setEmoji('🔎')
    .setStyle(ButtonStyle.Secondary);
const link = new ButtonBuilder()
    .setLabel('Link to Message')
    .setEmoji('🔗')
    .setStyle(ButtonStyle.Link);
