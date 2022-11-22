import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, EmbedBuilder, InteractionReplyOptions, MessageActionRowComponentBuilder, Snowflake } from "discord.js";
import { Document, Types } from "mongoose";
import { Iwarn, warnings } from "./schema/warns";

export type recordDoc = Document<unknown, any, Iwarn> & Iwarn & {_id: Types.ObjectId;}
export const warning ={
    add: addWarning,
    //remove: removeWarning,
    removeById: removeWarningById,
    get: viewWarning,
    updateById: updateWarning
}

const date = new Date()
date.setDate(new Date().getDate()+90)
async function addWarning(guildId: Snowflake, userId: Snowflake, officerId: Snowflake, reason: string | null, endedDate: Date | null ) {
    let setReason = reason, expireAt = endedDate;
    if(setReason == null)
        setReason = 'No Reason Given'
    if(expireAt == null)
        expireAt = date
    return warnings.create({ guildId:guildId, userId: userId, officerId: officerId, reason: setReason, expireAt: expireAt})
}

async function removeWarningById(id:string, permanentlyDelete:boolean = false) {
    if(permanentlyDelete)
        return await warnings.findByIdAndRemove(id)
    else
       return await warnings.findByIdAndUpdate(id,{expireAt: new Date()})
}

async function viewWarning(guildId: Snowflake, userId: Snowflake, expireAt?: Date) {
    let search: any
    if(!expireAt)
        search = {guildId: guildId, userId: userId}
    else
        search = {guildId: guildId, userId: userId, expireAt: { $gte: expireAt}}
    return warnings.find(search)
}

async function updateWarning(id:string, reason:string, officerId:string, date?:Date) {
    return warnings.findByIdAndUpdate(id, {reason:reason, officerId:officerId})
}

export function renderWarnings(records: recordDoc[], userId:string ,start:number = 0) {
    const embeds: EmbedBuilder[] = [],
    actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>(),
    length = records.length
    for (let index = start; index < start + 3 && index < length; index++) {
        const record = records[index],
        exspiresAt = Math.floor(record.expireAt.getTime()/1000)
        let color:ColorResolvable
        if(record.expireAt > new Date())
            color = getColor(0)
        else
            color = getColor(2)
        const embed = new EmbedBuilder()
            .setTitle('Warn')
            .setDescription(`**Reason:** ${record.reason}`)
            .setColor(color)
            .addFields(
                { name: 'Target', value: `<@${record.userId}>`, inline: true },
                { name: 'Officer', value: `<@${record.officerId}>`, inline: true},
                { name: 'Exspires', value: `<t:${exspiresAt}:R>\n <t:${exspiresAt}:F>`, inline: true})
            .setFooter({text: `ID: ${record._id}`})
            .setTimestamp(record.createdAt)
        embeds.push(embed)
    }
    const leftButton = new ButtonBuilder()
        .setCustomId(`viewWarn ${userId} ${start + 3}`)
        .setEmoji('⬅️')
        .setStyle(ButtonStyle.Secondary),
    rightButton = new ButtonBuilder()
        .setCustomId(`viewWarn ${userId} ${start - 3}`)
        .setEmoji('➡️')
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
    if(start >= 3) {
        rightButton.setDisabled(false)
        if(start + 3 > length)
            leftButton.setDisabled(true)
    }
    console.log(length)
    if(length > 3) {
        actionRow.addComponents(leftButton,rightButton)
        return {embeds:embeds, components:[actionRow]}
    } else if(length == 0) {
        return { content: 'User does not have any warns' }
    } else {
        return {embeds:embeds}
    }
}

export function getColor(length:number): ColorResolvable {
    let color: ColorResolvable
    switch (length) {
        case 0:
            color = 'Green'
            break;
        case 1:
            color = 'Yellow'
            break;
        case 2:
            color = 'Red'
            break;
        default:
            color = 'DarkButNotBlack'
            break;
    }
    return color
}
