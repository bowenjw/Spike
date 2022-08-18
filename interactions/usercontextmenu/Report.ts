import { ApplicationCommandType, ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from "discord.js";
import { getReportModal } from "../../system/report";
import { ContextMenu } from "../../types";

const contextmenu:ContextMenu = {
    name:"Report",
    contextMenuBuilder: new ContextMenuCommandBuilder()
        .setName("Report")
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction: UserContextMenuCommandInteraction) {
        await interaction.showModal(getReportModal(interaction.user.username));
    },
}
export = contextmenu;