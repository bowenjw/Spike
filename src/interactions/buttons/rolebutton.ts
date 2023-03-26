import { ButtonInteraction, EmbedBuilder, GuildMemberRoleManager, InteractionReplyOptions, InteractionUpdateOptions } from 'discord.js';
import { Interaction } from '../../classes/Interaction';
import { alignmentMenu, notificationsMenu, pronounMenu, religionMenu, roleButton } from '../../features/roles';

export default new Interaction<ButtonInteraction>()
    .setName('roles')
    .setExecute(async (interaction) => {
        const style = interaction.component.style,
            args = interaction.customId.split('_');
        let message:InteractionUpdateOptions | InteractionReplyOptions | undefined;

        switch (args[1]) {
        case 'note':
            message = notifications(interaction);
            break;
        case 'pronoun':
            message = pronoun(interaction);
            break;
        case 'religion':
            message = religion(interaction);
            break;
        case 'align':
            message = alignment(interaction);
            break;
        default:
            break;
        }

        if (style == 3) {
            (message as InteractionReplyOptions).ephemeral = true;
            interaction.reply(message as InteractionReplyOptions);
        }
        else {
            interaction.update(message as InteractionUpdateOptions);
        }
    });

function notifications(interaction:ButtonInteraction): InteractionUpdateOptions | InteractionReplyOptions | undefined {
    if (!(interaction.member?.roles instanceof GuildMemberRoleManager)) { return; }
    return {
        embeds:[new EmbedBuilder()
            .setTitle('Notification Roles')
            .setColor(interaction.client.config.colors.embed)],
        components:[
            notificationsMenu(interaction.member.roles),
            roleButton(0),
        ],
    };
}
function pronoun(interaction:ButtonInteraction): InteractionUpdateOptions | InteractionReplyOptions | undefined {
    if (!(interaction.member?.roles instanceof GuildMemberRoleManager)) { return; }
    return {
        embeds:[new EmbedBuilder()
            .setTitle('Pronoun Roles')
            .setColor(interaction.client.config.colors.embed)],
        components:[
            pronounMenu(interaction.member.roles),
            roleButton(1),
        ],
    };
}
function religion(interaction:ButtonInteraction) {
    if (!(interaction.member?.roles instanceof GuildMemberRoleManager)) { return; }
    return {
        embeds:[new EmbedBuilder()
            .setTitle('Religion Roles')
            .setColor(interaction.client.config.colors.embed)],
        components:[religionMenu(interaction.member.roles),
            roleButton(3),
        ],
    };
}

function alignment(interaction:ButtonInteraction) {
    if (!(interaction.member?.roles instanceof GuildMemberRoleManager)) { return; }
    return {
        embeds:[new EmbedBuilder()
            .setTitle('Political Alignment Roles')
            .setColor(interaction.client.config.colors.embed)],
        components:[alignmentMenu(interaction.member.roles),
            roleButton(2),
        ],
    };
}