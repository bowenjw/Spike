/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { warnEmbedRender } from '../../features/warningRender';
import { ModalSubmit } from '../../interfaces';
import { warnings } from '../../schema';

const modal:ModalSubmit = {
    name:'warnUpdate',
    execute: async (_client, interaction) => {

        const reason = interaction.fields.getTextInputValue('warnupdate'),
            newWarn = (await warnings.updateById(interaction.customId.split(' ')[1], interaction.user, reason))!,
            target = interaction.guild?.members.cache.find(m => m.id == newWarn?.target.id)?.user!;

        newWarn.reason = reason;

        interaction.message?.edit({ embeds:[warnEmbedRender(newWarn, target).setTitle('Warn | Updated')] });
        interaction.reply({ content:`Warning for ${target} has been updated`, ephemeral:true });
    },
};

export default modal;