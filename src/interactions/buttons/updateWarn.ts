import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button } from '../../interfaces';
import { warnings } from '../../schema';


const button: Button = {
    name: 'updateWarn',
    execute: async (_client, interaction) => {
        const warnId = interaction.customId.split(' ')[1],
            record = await warnings.findById(warnId);
        if (!record) {
            interaction.reply({ content:'Warning not found', ephemeral:true });
            return;
        }
        const warnTextInput = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
            .setCustomId('warnupdate')
            .setStyle(TextInputStyle.Paragraph)
            .setLabel('Reason')
            .setValue(record.reason)
            .setMaxLength(400)
            .setRequired(true)
            .setPlaceholder('Reason why member was warned')),
            updateModel = new ModalBuilder()
                .setCustomId(`warnUpdate ${record._id}`)
                .setTitle('Update Reason for Warning')
                .addComponents(warnTextInput);
        interaction.showModal(updateModel);
    },
};

export default button;