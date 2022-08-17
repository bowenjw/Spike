import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { ContextMenu } from "../../types";

const contextmenu:ContextMenu = {
    name:"Report",
    contextMenuBuilder: new ContextMenuCommandBuilder()
        .setName("Report")
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false),
    async execute(interaction) {
        console.log(interaction);
        interaction.reply({content:"echo",ephemeral:true})
    },
}
export = contextmenu;