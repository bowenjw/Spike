import { ApplicationCommandType, ContextMenuCommandBuilder, PermissionsBitField } from 'discord.js';
import { amputator } from '../../features';
import { MessageContextMenu } from '../../interfaces';

const contextMenu: MessageContextMenu = {
    options: new ContextMenuCommandBuilder()
        .setName('Amputator')
        .setType(ApplicationCommandType.Message)
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
    global: true,
    execute:amputator,
};

export default contextMenu;