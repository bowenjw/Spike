import { ButtonInteraction, GuildMember } from "discord.js";
import {warningTemp, warningSchema} from '../../schema/warnschema';

import { Button } from '../../types'

const button: Button = {
    name: 'warn',
    execute(interaction: ButtonInteraction) {
        const splitArgs = interaction.customId.split(' '),
            target = interaction.guild!.members.cache.find((member)=> member.id == splitArgs[2])!
        switch (splitArgs[1]) {
            case 'prev':
                prev(interaction, target, parseInt(splitArgs[3], 10));
                break;
            case 'next':
                next(interaction, target,  parseInt(splitArgs[3], 10));
                break;
            case 'warn':
                warn(interaction, splitArgs[2], Boolean(splitArgs[3]));
                break;
            case 'cancel':
                cancel(interaction, splitArgs[2]);
                break;
            default:
                break;
        }
    }
}
async function prev(interaction:ButtonInteraction, target:GuildMember, startingWarning:number) {
    
}
async function next(interaction:ButtonInteraction, target:GuildMember, startingWarning:number) {
    const guild = interaction.guild!,
        warnnings = await warningSchema.find({guildID: guild.id, userID: target.id});

    //interaction.update({embeds:[embed], components:[row], ephemeral:true})
}
async function warn(interaction:ButtonInteraction, warningId:string, isSilent:boolean) {
    const temp = await warningTemp.findById(warningId);
    const warning = new warningSchema({
        guildID: temp!.guildID,
        userID: temp!.userID,
        officerID: temp!.officerID,
        reason: temp!.reason,
        expireAt: temp!.expireAt
    });
    await warning.save()
    let content = `A warning has been issed to <@${temp!.userID}>`
    if(isSilent){
        content = `A warning has been silently issed to <@${temp!.userID}>`
    }
    interaction.update({content: content, embeds:[], components:[]})
    await warningTemp.findByIdAndDelete(warningId)
}
async function cancel(interaction:ButtonInteraction, warningId:string) {
    await warningTemp.findByIdAndDelete(warningId)
    interaction.update({content: 'Warning has been canceled', embeds:[], components:[]})
}
export = button;