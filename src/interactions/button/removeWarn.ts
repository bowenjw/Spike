import { ActionRowBuilder, ButtonInteraction, MessageActionRowComponentBuilder } from "discord.js";
import { warnEmbedRender, buttons } from "../../features/warningRender";
import { warnings } from "../../schema";

export const name = 'removeWarn'

export async function execute(interaction:ButtonInteraction) {

    // console.log(interaction.memberPermissions?.has(PermissionsBitField.Flags.BanMembers, true))

    // if(!interaction.memberPermissions?.has(PermissionsBitField.Flags.BanMembers, true)) {
    //     interaction.reply({content:'You do not have the permission to remove warnings', ephemeral:true})
    //     return
    // }
    
    const warn = (await warnings.updateById(interaction.customId.split(' ')[1],interaction.user,undefined,0))
    console.log(warn)
    if(!warn) {
        interaction.message.delete()
        interaction.reply({content:'Warning has already been deleted', ephemeral:true})
        return
    }
    warn.expireAt = new Date
    const target = (await interaction.guild?.members.fetch(warn?.target.id!))!.user,
    embed = warnEmbedRender(warn,target).setTitle('Warn | Ended').setColor('Green'),
    warnActionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttons.viewWarnButton(target.id))
    
    interaction.update({embeds:[embed], components:[warnActionRow]})
}