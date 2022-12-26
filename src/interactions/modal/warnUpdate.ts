import { ModalSubmitInteraction } from "discord.js";
import { warnEmbedRender } from "../../features/warningRender";
import { warnings } from "../../schema";

export const name = 'warnUpdate'
export async function execute(interaction: ModalSubmitInteraction) {
    
    const reason = interaction.fields.getTextInputValue('warnupdate'),
    newWarn = (await warnings.updateById(interaction.customId.split(' ')[1], interaction.user, reason))!,
    target = (await interaction.guild?.members.fetch(newWarn?.target.id!))!.user

    newWarn.reason = reason
    
    interaction.message?.edit({embeds:[warnEmbedRender(newWarn,target).setTitle('Warn | Updated')]})
    interaction.reply({content:`Warning for ${target} has been updated`, ephemeral:true})
}