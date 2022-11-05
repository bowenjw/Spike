import { ApplicationCommandType, ContextMenuCommandBuilder, PermissionFlagsBits } from "discord.js";
import { userReport } from "../../system/report_modal";

export const builder = new ContextMenuCommandBuilder()
    .setName('Report User')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setType(ApplicationCommandType.User)
export {userReport as execute}