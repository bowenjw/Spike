import { ButtonBuilder, ButtonStyle, Colors, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { TimeStyles } from '../../Client';
import { Warn } from './Warn';
import { WarmEmbedColor } from './types';

export function viewWarningMessageRender(warns: Warn[], start:number = 0) {
    const embeds: EmbedBuilder[] = [];
    const numberofWarns = warns.length;

    for (let index = start; index < start + 3 && index < numberofWarns; index++) {
        const record = warns[index];
        embeds.push(
            record.toEmbed(false,
                record.expireAt > new Date() ? WarmEmbedColor.Active : WarmEmbedColor.Inactive));
    }

    return embeds;
}

export function removeWarnEmbed(record:Warn, remover:GuildMember, deleted: boolean = false) {
    const embed = new EmbedBuilder()
        .setTitle(`Warn | ${deleted ? 'Deleted' : 'Removed'}`)
        .setDescription(`**Reason for Warning:** ${record.reason}`)
        .addFields(
            { name: 'Target', value: `${record.member}\n${record.member.user.username}`, inline: true },
            { name: 'Officer', value: `<${record.officer}>\n${record.officer.user.username}`, inline: true },
            { name: 'Removed By', value: `${remover}\n${remover.user.username}`, inline:true })
        .setTimestamp();

    if (deleted) {
        return embed.setColor(WarmEmbedColor.Inactive);
    }
    else {
        return embed.setColor(WarmEmbedColor.Active).setFooter({ text:`ID: ${record.id}` });
    }
}

export function dmEmbed(record:Warn, numberOfWarns:number) {
    const { guild, reason, expireAt } = record;
    const embed = new EmbedBuilder()
        .setTitle('Warning')
        .setDescription(`**Reason:** ${reason}`)
        .setColor(WarmEmbedColor.Issued)
        .addFields(
            { name:'Number of active warning(s)', value:`${numberOfWarns}` },
            { name:'Time till warn epxeration', value: expireAt.toDiscordString(TimeStyles.RelativeTime) })
        .setAuthor({ name:guild.name, iconURL:guild.iconURL({ forceStatic:true })! })
        .setTimestamp(record.createdAt);
    return embed;
}
export function banDmEmbed(interation:CommandInteraction, banReason:string, appealMessage?:string) {
    const embed = new EmbedBuilder()
        .setAuthor({ name:interation.guild.name, iconURL:interation.guild.iconURL({ forceStatic:true }) })
        .setTimestamp()
        .setTitle('Banned')
        .setDescription(banReason)
        .setColor(Colors.Red);
    if (appealMessage) embed.addFields({ name:'Appeal Info', value:appealMessage });
    return embed;
}
export const buttons = {
    viewWarnButton: viewbutton,
    updateButton: updateButton,
    removeButton: removeButton,
    leftButton: leftButton,
    rightButton: rightButton,
};

function viewbutton(target:GuildMember) {
    return new ButtonBuilder()
        .setCustomId(`warn_v_${target.id}`)
        .setLabel('View Warnings')
        .setStyle(ButtonStyle.Secondary);
}
function updateButton(warn:Warn) {
    return new ButtonBuilder()
        .setCustomId(`warn_u_${warn.id}`)
        .setLabel('Update Reason')
        .setStyle(ButtonStyle.Success);
}
function removeButton(warn:Warn) {
    return new ButtonBuilder()
        .setCustomId(`warn_r_${warn.id}`)
        .setLabel('End Warning')
        .setStyle(ButtonStyle.Danger);
}
function leftButton(targetid:string, disabled:boolean = false, start:number = 0) {
    return new ButtonBuilder()
        .setCustomId(`warn_v_${targetid} ${start + 3}`)
        .setEmoji('⬅️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled);
}
function rightButton(targetid:string, disabled:boolean = true, start:number = 0) {
    return new ButtonBuilder()
        .setCustomId(`warn_v_${targetid} ${start - 3}`)
        .setEmoji('➡️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled);
}
