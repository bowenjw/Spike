import { ApplicationCommandType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction } from "discord.js";
import { getReportModal } from "../../system/report";
import { ContextMenu } from "../../types";

const contextmenu:ContextMenu = {
    name:"Report",
    contextMenuBuilder: new ContextMenuCommandBuilder()
        .setName("Report")
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false),
    async execute(interaction: MessageContextMenuCommandInteraction) {
        await interaction.showModal(getReportModal(interaction.user.username));

    },
}
export = contextmenu;