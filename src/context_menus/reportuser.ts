import { ApplicationCommandType, PermissionFlagsBits, UserContextMenuCommandInteraction } from 'discord.js';
import { ContextMenuCommand } from '../classes/Command';
import { reportModal } from '../features/report';

export default new ContextMenuCommand()
    .setBuilder((builder) => builder
        .setName('Report User')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages))
    .setGlobal(true)
    .setExecute(execute);

async function execute(interaction:UserContextMenuCommandInteraction) {
    interaction.showModal(reportModal
        .setCustomId(`report_u_${interaction.targetUser.id}`));
}