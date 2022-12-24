import { ActionRowBuilder, GuildMember, MessageActionRowComponentBuilder, ModalSubmitInteraction, TextChannel } from "discord.js";
import { guildDB } from "../../util/schema/guilds";
import { warnDB } from "../../util/schema/warns";
import { buttons, warnEmbedRender } from "../../util/system/warningRender";

export async function modalInteractionExecute(interaction: ModalSubmitInteraction) {
    
    const reason = interaction.fields.getTextInputValue('warnupdate'),
    newWarn = (await warnDB.updateById(interaction.customId.split(' ')[1], interaction.user, reason))!,
    target = (await interaction.guild?.members.fetch(newWarn?.target.id!))!.user

    newWarn.reason = reason
    
    interaction.message?.edit({embeds:[warnEmbedRender(newWarn,target).setTitle('Warn | Updated')]})
    interaction.reply({content:`Warning for ${target} has been updated`, ephemeral:true})
}