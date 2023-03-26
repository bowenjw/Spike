import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Interaction } from '../../classes/Interaction';

const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
            .setLabel('Debate Here')
            .setEmoji('832594419416170516')
            .setURL('discord://discord.com/channels/831487586412396595/1089273962841768017')
            .setStyle(ButtonStyle.Link));

const embed = new EmbedBuilder()
    .setTitle('How To Debate Hunter')
    .setDescription('Hunter debates members live on stream Monday, Wensday and Friday between <t:1679752800:t> and <t:1679756400:t>.\n\nIf you would like to debate Hunter Join the stage channel <#1089273962841768017>');
export default new Interaction<ButtonInteraction>()
    .setName('debate')
    .setExecute(async (interaction) => {
        interaction.reply({
            embeds:[embed],
            components:[row],
            ephemeral:true,
        });
    });