import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { Interaction } from '../../classes/Interaction';

export default new Interaction<ButtonInteraction>()
    .setName('socials')
    .setExecute(async (interaction) => {
        interaction.reply({
            components:[new ActionRowBuilder<ButtonBuilder>()
                .addComponents(new ButtonBuilder()
                    .setLabel('Twitter')
                    .setEmoji('998068399810818068')
                    .setURL('https://twitter.com/HunterAA6')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel('Instagram')
                    .setEmoji('1011402275178160162')
                    .setURL('https://www.instagram.com/hunteravallone/')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel('TikTok')
                    .setEmoji('1043206347551940659')
                    .setURL('https://www.tiktok.com/@hunteravallonebits')
                    .setStyle(ButtonStyle.Link)),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(new ButtonBuilder()
                    .setLabel('YouTube')
                    .setEmoji('1067245118370889799')
                    .setURL('https://www.youtube.com/@hunteravallone')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel('Twitch')
                    .setEmoji('998793958786334820')
                    .setURL('https://www.twitch.tv/hunteravallone')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel('Spotify')
                    .setEmoji('1011401073631711372')
                    .setURL('https://open.spotify.com/show/3PVaA1kEndtnp5fLMGNLOL')
                    .setStyle(ButtonStyle.Link))],
            ephemeral:true,
        });
    });
