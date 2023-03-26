import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from 'discord.js';
import { ChatInputCommand } from '../classes/Command';

export default new ChatInputCommand()
    .setBuilder((builder) => builder
        .setName('info')
        .setDescription('Send Info message to channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Channel the message will be sent to')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)))
    .setGlobal(true)
    .setExecute(execute);

async function execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel('channel', true);
    if (!(channel instanceof TextChannel)) { return; }
    await channel.send('https://cdn.discordapp.com/attachments/1084915696997244959/1089344191345209354/Twitter-Banner.png');
    await channel.send({
        embeds:[new EmbedBuilder()
            .setTitle('Welcome to the Hunter Avallone Discord')
            .setDescription('The official Discord community for Hunter Avallone, the sever is openly political, mainly left-leaning . We are looking for new members to engage and bring new ideas and perspectives, including ones that may not align with our own.')
            .setColor(interaction.client.config.colors.embed)],
        components:[new ActionRowBuilder<ButtonBuilder>()
            .addComponents(new ButtonBuilder()
                .setCustomId('rules')
                .setLabel('Rules')
                .setEmoji('📜')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('roles_note')
                .setLabel('Roles')
                .setEmoji('🛠️')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setLabel('Debate Hunter')
                .setCustomId('debate')
                .setEmoji('832592130102919209')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('socials')
                .setLabel('Socials')
                .setEmoji('🔗')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setLabel('Website')
                .setEmoji('🌐')
                .setURL('https://www.hunteravallone.live/')
                .setStyle(ButtonStyle.Link))],
    });
    interaction.reply({ content:`messages sent to ${channel}`, ephemeral:true });

}
