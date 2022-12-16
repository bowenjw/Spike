import { ActionRowBuilder, ButtonInteraction, MessageActionRowComponentBuilder } from "discord.js";
import { warnDB } from "../../util/schema/warns";
import { buttons, viewWarningMessageRender } from "../../util/system/warningRender";

export async function buttonInteractionExecute(interaction:ButtonInteraction) {
    
    const pream = interaction.customId.split(' '),
    targetId = pream[1], start = Number(pream[2]),
    records = await warnDB.find(interaction.guildId!, targetId, new Date)
    
    if(records.length == 0) {
        interaction.reply({content:`<@${targetId}> has no active warnings`, ephemeral:true})
    } else if(isNaN(start)) {
        interaction.reply({embeds:viewWarningMessageRender(records,0), ephemeral:true})
    } else {

        // determains wich nav arows are on
        let rightButtonDisabled = false, leftButtonDisabled = false
        if(start == 0)
            rightButtonDisabled = true
        else if(start + 3 >= records.length)
            leftButtonDisabled = true

        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        buttons.leftButton(targetId,leftButtonDisabled,start),
        buttons.rightButton(targetId,rightButtonDisabled,start))
        interaction.update({embeds:viewWarningMessageRender(await warnDB.find(interaction.guildId!, targetId), start), components:[row]})
    }
}