import { ApplicationCommandType, ContextMenuCommandBuilder, PermissionFlagsBits } from "discord.js";
import { userReport } from "../../system/report_modal";
import { ContextMenu } from "../../types";

const menu = new ContextMenuCommandBuilder()
    .setName('Report User')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator)
    .setType(ApplicationCommandType.User)
const contextmenu: ContextMenu = {
    name:menu.name,
    contextMenuBuilder: menu,
    execute: userReport
}
export = contextmenu