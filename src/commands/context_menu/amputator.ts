import { ApplicationCommandType, ContextMenuCommandBuilder, PermissionsBitField } from "discord.js"
export { amputator as execute } from "../../features"

export const builder = new ContextMenuCommandBuilder()
    .setName("Amputator")
    .setType(ApplicationCommandType.Message)
    .setDMPermission(true)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
global = true
