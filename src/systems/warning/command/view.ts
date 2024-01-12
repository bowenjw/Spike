import { ActionRowBuilder, ChatInputCommandInteraction, GuildMember, MessageActionRowComponentBuilder } from 'discord.js';
import { warningDb } from '../warn-schema';
import { buttons, viewWarningMessageRender } from '../warningRender';

export async function view(interaction: ChatInputCommandInteraction, target:GuildMember) {
    const months = interaction.options.getInteger('scope');
    const actionRow:ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
    let date:Date | undefined = new Date();
    let show = interaction.options.getBoolean('show');

    if (months == 0) {
        date = undefined;
    }
    else if (months != null) {
        date.setMonth(-months);
    }

    const records = await warningDb.getWarnsOfMember(target, date);

    if (records.length == 0) {
        interaction.reply({ content:`${target} has no active warns or warns in the selected scope`, ephemeral:true });
        return;
    }
    else if (records.length > 3) {
        actionRow.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttons.leftButton(target.id), buttons.rightButton(target.id)));
    }

    if (show == null) { show = undefined; }

    interaction.reply({ embeds:viewWarningMessageRender(records), components:actionRow, ephemeral:!show });
}
