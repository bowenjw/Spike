/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ActionRowBuilder, MessageActionRowComponentBuilder } from 'discord.js';
import { warnings } from '../../schema';
import { viewWarningMessageRender, buttons } from '../../features/warningRender';
import { Button } from '../../interfaces';

const button: Button = {
    name: 'viewWarn',
    execute: async (_client, interaction) => {
        // console.log(interaction.customId)
        const pream = interaction.customId.split(' '),
            targetId = pream[1], start = Number(pream[2]),
            records = await warnings.find(interaction.guildId!, targetId, new Date);

        if (isNaN(start)) {
            interaction.reply({ embeds:viewWarningMessageRender(records, 0), ephemeral:true });
        }
        else {
            // determains wich nav arows are on
            let rightButtonDisabled = false, leftButtonDisabled = false;
            if (start == 0) {
                rightButtonDisabled = true;
            }
            else if (start + 3 >= records.length) {
                leftButtonDisabled = true;
            }

            const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                buttons.leftButton(targetId, leftButtonDisabled, start),
                buttons.rightButton(targetId, rightButtonDisabled, start));
            interaction.update({ embeds:viewWarningMessageRender(await warnings.find(interaction.guildId!, targetId), start), components:[row] });
        }
    },
};

export default button;