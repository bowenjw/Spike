import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { ChatInputCommand } from '../../interfaces';

const command:ChatInputCommand = {
    options: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gets the current latencey of the bot')
        .setDMPermission(true),
    global: true,
    execute:(client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle('Current Latencey')
            .addFields(
                { name: 'Command Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
                { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true })
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [embed] });
    },
};

export default command;
