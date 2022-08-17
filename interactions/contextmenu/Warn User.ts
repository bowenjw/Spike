import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { ContextMenu } from "../../types";

const contextmenu:ContextMenu = {
    name:"Warn User",
    contextMenuBuilder: new ContextMenuCommandBuilder()
        .setName("Warn User")
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        console.log(interaction);
        interaction.reply({content:"echo",ephemeral:true})
    },
}
export = contextmenu;