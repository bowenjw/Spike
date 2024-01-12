import { ActionRowBuilder, ChatInputCommandInteraction, GuildMember, MessageActionRowComponentBuilder, PermissionsBitField } from 'discord.js';
import { WarningConfig } from '../../guild';
import { warningDb } from '../warn-schema';
import { banDmEmbed, buttons, dmEmbed } from '../warningRender';

export async function add(interaction: ChatInputCommandInteraction, target:GuildMember, officer:GuildMember, warningConfig: WarningConfig) {
    if (target.permissions.has(PermissionsBitField.Flags.ManageGuild, true)) {
        interaction.reply({ content:'You can not warn this user bcaues that have `Manager Server` or `Administrator` permissions', ephemeral:true });
        return;
    }

    const reason = interaction.options.getString('reason');
    const days = interaction.options.getInteger('duration');


    const exsitingWarns = await warningDb.getWarnsOfMember(target);
    const newWarn = await warningDb.createWarning(target, officer, reason, days);
    const logChannel = warningConfig.channel;
    const numberOfWarns = exsitingWarns.length;
    // Log Embed
    const logEmbed = newWarn.toEmbed();

    // Action Row
    const viewWarnButton = buttons.viewWarnButton(target);

    // interaction reply
    interaction.reply({
        embeds:[logEmbed],
        components:[new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(viewWarnButton)],
        ephemeral:true,
    });

    const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttons.updateButton(newWarn), viewWarnButton);

    if (days != 0) {actionRow.addComponents(buttons.removeButton(newWarn));}

    // Message to log channel
    if (logChannel) { logChannel.send({ embeds:[logEmbed], components:[actionRow] });}

    const dm = dmEmbed(newWarn, numberOfWarns);
    const maxWarns = warningConfig.maxWarns;
    // if user has gotten 3 active warnings and the most resent is not a 0 day warn and if they can be banned
    if (days != 0 && numberOfWarns >= maxWarns && target.bannable && maxWarns != 0) {

        const BanReason = `Automatic action after ${maxWarns} concurrent warnings`;
        await target.send({ embeds:[dm, banDmEmbed(interaction, reason, warningConfig.appealMessage)] });
        await target.ban({ reason:BanReason });

    }
    else {
        await target.send({ embeds:[dm] }).catch(err => console.log(err));
    }


}
