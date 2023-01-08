import { Snowflake, EmbedBuilder, ColorResolvable, ButtonBuilder, ButtonStyle, User, CommandInteraction, Colors } from "discord.js"
import { warningRecord } from "../schema/warnings"

export enum WarmEmbedColor {
    Green = '#57F287',
    Yellow = '#FEE75C',
    Red = '#ED4245'
}

export function warnEmbedRender(record:warningRecord, target:User) {

    const expireAt = Math.floor(record.expireAt.getTime()/1000),

    logEmbed = new EmbedBuilder()
        .setTitle('Warn')
        .setDescription(`**Reason:** ${record.reason}`)
        .addFields(
            { name: 'Target', value: `${target}\n${target.tag}`, inline: true },
            { name: 'Officer', value: `<@${record.officer.id}>\n${record.officer.tag}`, inline: true},
            { name: 'Exspiers', value: `<t:${expireAt}:R>\n <t:${expireAt}:F>`, inline: true})
        
        .setColor(WarmEmbedColor.Yellow)
        .setThumbnail(target.avatarURL({forceStatic:true}))
        .setFooter({text: `ID: ${record._id}`})
        .setTimestamp((record as any).updatedAt)

    return logEmbed
}

export function viewWarningMessageRender(records: warningRecord[], start:number = 0) {
    const embeds: EmbedBuilder[] = [],
    numberofWarns = records.length

    for (let index = start; index < start + 3 && index < numberofWarns; index++) {
        const record = records[index],
        exspiresAt = Math.floor(record.expireAt.getTime()/1000)

        let color:ColorResolvable = WarmEmbedColor.Red
        
        if(record.expireAt > new Date()) { color = WarmEmbedColor.Green }

        const embed = new EmbedBuilder()
            .setTitle('Warn')
            .setDescription(`**Reason:** ${record.reason}`)
            .setColor(color)
            .addFields(
                { name: 'Target', value: `${record.target.tag}\n<@${record.target.id}>`, inline: true },
                { name: 'Officer', value: `${record.officer.tag}\n<@${record.officer.id}>`, inline: true},
                { name: 'Exspiers', value: `<t:${exspiresAt}:R>\n<t:${exspiresAt}:F>`, inline: true})
            .setFooter({text: `ID: ${record._id}`})
            .setTimestamp(record.createdAt)
        embeds.push(embed)
    }
    return embeds
}
export function removeWarnEmbed(record:warningRecord, status:string, remover:User) {
    const embed = new EmbedBuilder()
        .setTitle(`Warn | ${status}`)
        .setDescription(`**Reason for Warning:** ${record?.reason}`)
        .addFields(
            { name: 'Target', value: `${record?.target.tag}\n__Id__: \`${record?.target.id}\``, inline: true },
            { name: 'Officer', value: `${record?.officer.tag}\n__Id__: \`${record?.officer.id}\``, inline: true},
            { name: 'Removed By', value: `${remover}\n${remover.tag}`, inline:true})
        .setTimestamp()

    if(status == 'Deleted') {
        return embed.setColor(WarmEmbedColor.Red)
    } else {
        return embed.setColor(WarmEmbedColor.Green).setFooter({text:`ID: ${record._id}`})
    }
}
export function dmEmbed(interation:CommandInteraction ,record:warningRecord, numberOfWarns:number) {
    const embed = new EmbedBuilder()
        .setTitle('Warning')
        .setDescription(`**Reason:** ${record.reason}`)
        .setColor(WarmEmbedColor.Yellow)
        .addFields(
            {name:'Number of active warning(s)',value:`${numberOfWarns}`},
            {name:'Time till warn epxeration', value:`<t:${Math.floor(record.expireAt.getTime()/1000)}:R>`})
        .setAuthor({name:interation.guild?.name!, iconURL:interation.guild?.iconURL({forceStatic:true})!})
        .setTimestamp(record.createdAt)
    return embed
}
export function banDmEmbed(interation:CommandInteraction, banReason:string, appealMessage?:string,) {
    const embed = new EmbedBuilder()
        .setAuthor({name:interation.guild?.name!, iconURL:interation.guild?.iconURL({forceStatic:true})!})
        .setTimestamp()
        .setTitle('Banned')
        .setDescription(banReason)
        .setColor(Colors.Red)
    if(appealMessage) embed.addFields({name:'Appeal Info', value:appealMessage})
    return embed
}
export const buttons = {
    viewWarnButton: viewbutton,
    updateButton: updateButton,
    removeButton: removeButton,
    leftButton: leftButton,
    rightButton: rightButton
}

function viewbutton(targetid:Snowflake) {
    return new ButtonBuilder()
        .setCustomId(`viewWarn ${targetid}`)
        .setLabel('View Warnings')
        .setStyle(ButtonStyle.Secondary)
}
function updateButton(warn:warningRecord) {
    return new ButtonBuilder()
        .setCustomId(`updateWarn ${warn._id}`)
        .setLabel('Update Reason')
        .setStyle(ButtonStyle.Success)
}
function removeButton(warn:warningRecord) {
    return new ButtonBuilder()
        .setCustomId(`removeWarn ${warn._id}`)
        .setLabel('End Warning')
        .setStyle(ButtonStyle.Danger)
}
function leftButton(targetid:string, disabled:boolean = false, start:number = 0) {
    return new ButtonBuilder()
        .setCustomId(`viewWarn ${targetid} ${start + 3}`)
        .setEmoji('⬅️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled)
}
function rightButton(targetid:string, disabled:boolean = true, start:number = 0) {
    return new ButtonBuilder()
        .setCustomId(`viewWarn ${targetid} ${start - 3}`)
        .setEmoji('➡️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled)
}