import { ActionRowBuilder, CommandInteraction, MessageContextMenuCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, UserContextMenuCommandInteraction } from "discord.js";

export async function report(interaction: CommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction) {
    interaction.reply({content:"Report recived", ephemeral: true})
}
export function getReportModal(username:string) {
    const modal = new ModalBuilder()
            .setCustomId('report')
            .setTitle('Report User');
        const reason = new TextInputBuilder()
            .setCustomId('reason')
            .setLabel(`Why are you reporting ${username}`)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)
            .setValue(`I am reporting ${username} because`)
            .setPlaceholder('No Reason Given');
        const firstActionRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(reason);
        modal.addComponents(firstActionRow);
        return modal
}