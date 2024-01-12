import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { guildsModel } from '../../guild';
import { add } from './add';
import { remove } from './remove';
import { view } from './view';

export { slashCommandBuilder as WarnChatCommandBuilder } from './builder';
/** ,
messageContextMenuCommand = new ContextMenuCommandBuilder()
    .setName('Warn')
    .setDMPermission(false)
    .setDefaultMemberPermissions(premission)
    .setType(ApplicationCommandType.Message),
userContextMenuCommand = new ContextMenuCommandBuilder()
    .setName('Warn')
    .setDMPermission(false)
    .setDefaultMemberPermissions(premission)
    .setType(ApplicationCommandType.User)
*/

export async function warnChatCommandExecute(interaction: ChatInputCommandInteraction) {
    const config = await guildsModel.getGuild(interaction.guild);
    if (!config.warning.enabled) {
        return interaction.reply({
            content: 'Warnning Subsystem is disabled use </config system:1039674799120711781> to enable it',
            ephemeral: true,
        });
    }
    // console.log(config)
    if (interaction.isChatInputCommand()) {
        const officer = interaction.member as GuildMember;
        const target = interaction.options.getMember('target')! as GuildMember;

        if (target.user.bot || target == officer) {
            return interaction.reply({ content:'Target can not be a bot or your self', ephemeral:true });
        }
        switch (interaction.options.getSubcommand(true)) {
        case 'add':
            add(interaction, target, officer, config.warning);
            break;
        case 'remove':
            remove(interaction, config.warning);
            break;
        case 'view':
            view(interaction, target);
            break;
        default:
            break;
        }
    }
}
