import { ActionRowBuilder, ButtonBuilder, ButtonInteraction } from 'discord.js';
import { ExtraColor, Interaction } from '../../Client';
import { moderateUserButton, userEmbed } from '../../systems/inspect';

export default new Interaction<ButtonInteraction>()
    .setName('inspect')
    .setExecute(inspect);

async function inspect(interaction: ButtonInteraction) {
    const member = interaction.guild.members.cache.find((_m, k) => k == interaction.customId.split('_')[1]);
    if (!member) {
        interaction.reply({
            content: 'User is no longer in the server',
            ephemeral: true,
        });
    }
    else {
        interaction.reply({
            embeds: [await userEmbed(member, ExtraColor.EmbedGray)],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(moderateUserButton(member.user))],
            ephemeral: true,
        });
    }

}
