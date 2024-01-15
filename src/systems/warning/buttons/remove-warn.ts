import { ActionRowBuilder, ButtonInteraction, MessageActionRowComponentBuilder } from 'discord.js';
import { warningDb } from '../warn-schema';
import { buttons } from '../warningRender';

export async function removeWarning(interaction:ButtonInteraction) {
    const { customId, client } = interaction;
    const warnId = customId.split(interaction.client.splitCustomIDOn)[1];
    const record = await warningDb.getWarnById(client, warnId);

    // console.log(interaction.memberPermissions?.has(PermissionsBitField.Flags.BanMembers, true))

    // if(!interaction.memberPermissions?.has(PermissionsBitField.Flags.BanMembers, true)) {
    //     interaction.reply({content:'You do not have the permission to remove warnings', ephemeral:true})
    //     return
    // }

    if (!record) {
        interaction.message.delete();
        interaction.reply({ content: 'Warning has already been deleted', ephemeral: true });
        return;
    }
    await record.setNewEndDate(new Date, interaction.member).save();
    const warnActionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttons.viewWarnButton(record.member));

    interaction.update({ embeds: [record.toEmbed(null, 'Green').setTitle('Warn | Ended')], components: [warnActionRow] });
}
