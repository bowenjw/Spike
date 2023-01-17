/* eslint-disable no-inline-comments */
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, GuildMember, HexColorString } from 'discord.js';
import { UserContextMenu } from '../../interfaces';

// Example user context menu

const contextMenu: UserContextMenu = {
    options: new ContextMenuCommandBuilder()
        .setName('WhoIs')
        .setType(ApplicationCommandType.User) // Specify the context menu type
        .setDMPermission(false),
    global: true,
    execute: async (client, interaction) => {
        let message:string;
        const member = interaction.targetMember as GuildMember,
            flags = member.user.flags?.toArray(),
            roles = member.roles.valueOf(),
            embed = new EmbedBuilder()
                .setTitle(member.displayName)
                .setFields(
                    { name:'Joined Discord', value:`<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`, inline:true },
                    { name:'Joined Server', value:member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'N/A', inline:true },
                )
                .setThumbnail(member.displayAvatarURL({ forceStatic:true }))
                .setColor(client.config.colors.embed as HexColorString)
                .setFooter({ text:`ID: ${member.id}` })
                .setTimestamp();

        if (roles.size > 1) {
            message = '';
            roles.filter(role => role.name != '@everyone').forEach(role => {
                message += `${role} `;
            });
            embed.addFields(
                { name:`Roles [${roles.size - 1}]`, value:message.slice(0, -1) },
            );
        }

        if (flags) {
            message = '';
            flags.forEach((flag) => {
                message += `${flag}, `;
            });
            embed.addFields(
                { name:'Flags', value:`\`\`\`ts\n${message.slice(0, -2)}\n\`\`\`` },
            );
        }

        interaction.reply({ embeds:[embed], ephemeral:true });
    },
};

export default contextMenu;