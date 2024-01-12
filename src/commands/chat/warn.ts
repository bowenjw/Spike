import { ChatInputCommand } from '../../Client';
import { WarnChatCommandBuilder, warnChatCommandExecute } from '../../systems/warning';

export default new ChatInputCommand()
    .setBuilder(WarnChatCommandBuilder)
    .setExecute(warnChatCommandExecute);
