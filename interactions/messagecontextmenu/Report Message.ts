import { ApplicationCommandType, ContextMenuCommandBuilder, PermissionFlagsBits } from "discord.js";
import { messageReport } from "../../system/report_modal";
import { ContextMenu } from "../../types";

const menu = new ContextMenuCommandBuilder()
    .setName('Report Message')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setType(ApplicationCommandType.Message)
const contextmenu: ContextMenu = {
    name:menu.name,
    contextMenuBuilder: menu,
    execute: messageReport
}
export = contextmenu