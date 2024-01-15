import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { warningDb } from '../warn-schema';


export async function updateWarn(interaction:ButtonInteraction) {
    const { customId, client } = interaction;

    const record = await warningDb.getWarnById(client, customId.split(client.splitCustomIDOn)[2]);

    if (!record) {
        interaction.reply({ content: 'Warning not found', ephemeral: true });
        return;
    }
    const warnTextInput = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
        .setCustomId('reason')
        .setStyle(TextInputStyle.Paragraph)
        .setLabel('Reason')
        .setValue(record.reason)
        .setMaxLength(400)
        .setRequired(true)
        .setPlaceholder('Reason why member was warned'));
    const updateModel = new ModalBuilder()
        .setCustomId(`updateWarn ${record.id}`)
        .setTitle('Update Reason for Warning')
        .addComponents(warnTextInput);
    interaction.showModal(updateModel);
}
