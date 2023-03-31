import { ActionRowBuilder, ButtonBuilder, ButtonInteraction } from 'discord.js';
import { Interaction } from '../../classes/Interaction';
import { moderateUserButton, userEmbed } from '../../features/inspect';

export default new Interaction<ButtonInteraction>()
    .setName('inspect')
    .setExecute(inspect);

async function inspect(interaction: ButtonInteraction) {
    const member = await interaction.guild.members.fetch(interaction.customId.split('_')[1]);
    interaction.reply({
        embeds: [await userEmbed(member, interaction.client.config.colors.embed)],
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(moderateUserButton(member.user))],
        ephemeral: true,
    });
}