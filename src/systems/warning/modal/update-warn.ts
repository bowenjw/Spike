import { GuildMember, ModalSubmitInteraction } from 'discord.js';
import { warningDb } from '../warn-schema';

export async function warnUpdateModal(interaction: ModalSubmitInteraction) {
    const { fields, client, customId } = interaction;
    const reason = fields.getTextInputValue('warnupdate');
    const newWarn = await warningDb.getWarnById(client, customId.split(client.splitCustomIDOn)[1]);

    newWarn.setReason(reason, interaction.member as GuildMember).save();

    interaction.message?.edit({ embeds:[newWarn.toEmbed().setTitle('Warn | Updated')] });
    interaction.reply({ content:`Warning for ${newWarn.member} has been updated`, ephemeral:true });
}
