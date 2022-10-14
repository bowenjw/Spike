import { ActionRowBuilder, ChatInputCommandInteraction, ComponentType, EmbedBuilder, ForumChannel, Guild, GuildMember, GuildResolvable, MessageContextMenuCommandInteraction, ModalBuilder, ModalSubmitInteraction, Snowflake, TextInputBuilder, TextInputStyle, UserContextMenuCommandInteraction } from "discord.js";
import { client } from "..";

const baseModal = new ModalBuilder()
    .setTitle('Report')
    .setCustomId('report'),
baseReason = new TextInputBuilder()
    .setCustomId('reason')
    .setLabel('Reason')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Why are you reporting this member')
    .setRequired(true),
baseChannel = new TextInputBuilder()
    .setCustomId('channel')
    .setLabel('Channel ID')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('ID of the channel misconduct happend')
    .setRequired(false),
baseMessage = new TextInputBuilder()
    .setCustomId('message')
    .setLabel('message ID')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('ID of the message misconduct happend')
    .setRequired(false),
baseReportEmbed = new EmbedBuilder()
    .setTitle('Reported')
    .setColor('Orange')
    .setFooter({text:'Report System'})
export async function chatReport(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getMember('target') as GuildMember,
            reason = interaction.options.getString('reason')
        //    channel = interaction.options.getChannel('channel');
        let chatReason = baseReason,
            chatChannel = baseChannel;
        if(reason)
            chatReason = chatReason.setValue(reason)
        /*if(channel)
            chatChannel = chatChannel.setValue(channel.name)*/
        const chatModal = baseModal.setTitle(`Report ${user.displayName}`)
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(chatReason),
                //new ActionRowBuilder<TextInputBuilder>().addComponents(chatChannel)
            )
            .setCustomId(`report ${user.id}`)
        interaction.showModal(chatModal)
}

export async function userReport(interaction: UserContextMenuCommandInteraction) {
    const user = interaction.targetMember as GuildMember,
        userModal = baseModal.setTitle(`Report ${user.displayName}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(baseReason),
        ).setCustomId(`report ${user.id}`)
    interaction.showModal(userModal)
}

export async function messageReport(interaction: MessageContextMenuCommandInteraction) {
    const user = await interaction.guild?.members.fetch(interaction.targetMessage.author) as GuildMember,
        messageModal = baseModal.setTitle(`Report ${user.displayName}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(baseReason),
        ).setCustomId(`report ${user.id}`)
    interaction.showModal(messageModal)
}

export async function modalReport(interaction: ModalSubmitInteraction) {
    interaction.reply({content:'Your report has been securely Submited',ephemeral:true})
    const target = await interaction.guild?.members.fetch(interaction.customId.split(' ')[1])!,
        channel = await getReportChannel(interaction.guild!, target),
        reporter = interaction.member as GuildMember
    const embed = baseReportEmbed
        .setAuthor({name:reporter.displayName, iconURL: reporter.displayAvatarURL() })
        .setDescription(`${target}`)
        .setTimestamp()
        .setFields(
            {name:'Reason', value:interaction.fields.getField('reason',ComponentType.TextInput).value}
        )
    channel?.send({embeds:[embed]})
}

async function getReportChannel(guilResolvable: GuildResolvable, target: GuildMember) {
    const guild = client.guilds.resolve(guilResolvable)
    if(!guild)
        return null;
    const reportForum = await guild.channels.fetch('1029498545499283456',{cache:true}) as ForumChannel
    let forumPost = reportForum.threads.cache.find(thread => thread.name == target.id)
    
    if(!forumPost)
        forumPost = await reportForum.threads.create({
            name: target.id,
            message: {content:`Start of reports for ${target}`}
        })
    return forumPost
}

