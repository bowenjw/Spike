import { ApplicationCommandType, ContextMenuCommandBuilder, MessageInteraction, PermissionFlagsBits } from "discord.js";
import { messageReport } from "../../system/report_modal";


export const builder = new ContextMenuCommandBuilder()
    .setName('Report Message')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setType(ApplicationCommandType.Message)
export {messageReport as execute}