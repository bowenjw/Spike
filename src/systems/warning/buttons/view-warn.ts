import { ActionRowBuilder, ButtonInteraction, MessageActionRowComponentBuilder } from 'discord.js';
import { warningDb } from '../warn-schema';
import { buttons, viewWarningMessageRender } from '../warningRender';

export async function viewWarnings(interaction:ButtonInteraction) {
    const { client, customId, guild } = interaction;
    const pream = customId.split(client.splitCustomIDOn);
    const target = guild.members.cache.get(pream[1]);
    const start = Number(pream[2]);
    const records = await warningDb.getWarnsOfMember(target, new Date);

    if (records.length == 0) {
        interaction.reply({ content: `${target} has no active warnings`, ephemeral: true });
    }
    else if (isNaN(start)) {
        interaction.reply({ embeds: viewWarningMessageRender(records, 0), ephemeral: true });
    }
    else {

        // determains wich nav arows are on
        let rightButtonDisabled = false, leftButtonDisabled = false;
        if (start == 0) {rightButtonDisabled = true;}
        else if (start + 3 >= records.length) {leftButtonDisabled = true;}

        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            buttons.leftButton(target.id, leftButtonDisabled, start),
            buttons.rightButton(target.id, rightButtonDisabled, start));
        interaction.update({ embeds: viewWarningMessageRender(records, start), components: [row] });
    }
}
