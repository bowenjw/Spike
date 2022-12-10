import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, EmbedBuilder, MessageActionRowComponentBuilder, Snowflake, User } from 'discord.js';
import { Document, Schema, model, Types} from 'mongoose';

interface Iuser {
    id: Snowflake,
    tag: String
}

interface Iwarn  {
    guildId: Snowflake,
    target: Iuser,
    officer: Iuser,
    reason: string,
    expireAt: Date,
    createdAt: Date
}

export type warningRecord = Document<unknown, any, Iwarn> & Iwarn & {_id: Types.ObjectId;}

const warn = new Schema<Iwarn>({
    guildId: { type: String, required: true, ref: 'guilds' },
    target: { 
        id:{ type: String, require:true },
        tag: { type: String, require:true }
    },
    officer: { 
        id:{ type: String, require:true },
        tag: { type: String, require:true }
    },
    reason: { type: String, required: true, default: 'No Reason Given' },
    expireAt: { type: Date, required:true }
}, {timestamps: true}),
warnings = model<Iwarn>('warnings', warn),
date = new Date(new Date().getDate()+90)

export const warnDB ={
    add: addWarning,
    //remove: removeWarning,
    removeById: removeWarningById,
    get: viewWarning,
    updateById: updateWarningById
}
/** Adds waring to the database
 * 
 * @param guildId The id of the Guild that the warn is in
 * @param target The targeted user
 * @param officer User issuing the warn
 * @param reason The reason of the warn
 * @param endedDate Date of the warnings exsperation
 * @returns The warning record
 */
async function addWarning(guildId: Snowflake, target: User, officer: User, reason: string | null, endedDate: Date | null ) {
    let setReason = reason, expireAt = endedDate;
    if(setReason == null) { setReason = 'No Reason Given' }
    if(expireAt == null) { expireAt = date }
    return warnings.create({ 
        guildId:guildId, 
        target:{ id:target.id, tag:target.tag }, 
        officer:{ id:officer.id, tag:officer.tag },
        reason: setReason, 
        expireAt: expireAt
    })
}

/** Remove warning by database id
 * 
 * @param id 
 * @param permanentlyDelete 
 * @returns The deleted database record
 */
async function removeWarningById(id:string, permanentlyDelete:boolean = false) {
    if(permanentlyDelete)
        return await warnings.findByIdAndRemove(id)
    else
       return await warnings.findByIdAndUpdate(id, { expireAt: new Date() })
}

/** View the warnings in the data base
 * 
 * @param guildId 
 * @param userId 
 * @param expireAt 
 * @returns 
 */
async function viewWarning(guildId: Snowflake, userId: Snowflake, expireAt?: Date) {
    let search: any
    if(!expireAt)
        search = {guildId: guildId, userId: userId}
    else
        search = {guildId: guildId, userId: userId, expireAt: { $gte: expireAt}}
    return warnings.find(search)
}

async function updateWarningById(id:string, reason:string, officerId:string, date?:Date) {
    return warnings.findByIdAndUpdate(id, {reason:reason, officerId:officerId})
}

export function renderWarnings(records: warningRecord[], target:User ,start:number = 0) {
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
                { name: 'Target', value: `${record.target.tag}\n<@${record.target.id}>`, inline: true },
                { name: 'Officer', value: `${record.officer.tag}\n<@${record.officer.id}>`, inline: true},
                { name: 'Exspires', value: `<t:${exspiresAt}:R>\n<t:${exspiresAt}:F>`, inline: true})
            .setFooter({text: `ID: ${record._id}`})
            .setTimestamp(record.createdAt)
        embeds.push(embed)
    }
    const leftButton = new ButtonBuilder()
        .setCustomId(`viewWarn ${target.id} ${start + 3}`)
        .setEmoji('⬅️')
        .setStyle(ButtonStyle.Secondary),
    rightButton = new ButtonBuilder()
        .setCustomId(`viewWarn ${target.id} ${start - 3}`)
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