import { ActionRowBuilder, ChatInputCommandInteraction, MessageActionRowComponentBuilder, PermissionsBitField } from 'discord.js';
import { WarningConfig } from '../../guild';
import { warningDb } from '../warn-schema';
import { buttons, removeWarnEmbed } from '../warningRender';

export async function remove(interaction: ChatInputCommandInteraction, config: WarningConfig) {

    const permDelete = interaction.options.getBoolean('delete');
    const id = interaction.options.getString('id', true);

    if (permDelete && !interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild, true)) {
        interaction.reply({ content:'You do not have the permission to delete warnings', ephemeral:true });
        return;
    }

    const record = await warningDb.getWarnById(interaction.client, id);

    if (!record) {
        interaction.reply({ content:'Error recored not found', ephemeral:true });
        return;
    }

    const updateEmbed = removeWarnEmbed(record, record.guild.members.cache.get(interaction.member.user.id));
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttons.viewWarnButton(record.member));

    const channel = config.channel;
    if (channel) { channel.send({ embeds:[updateEmbed], components:[row] }).catch((err) => console.log(err)); }

    interaction.reply({ embeds:[updateEmbed], components:[row], ephemeral:true });


}
