import { GuildMember, PermissionsBitField } from 'discord.js';
import { Button } from '../../interfaces';
import { warnings } from '../../schema';

const button: Button = {
    name: 'unban',
    execute: async (_client, interaction) => {
        const user = interaction.member as GuildMember;
        if (!user?.permissions.has(PermissionsBitField.Flags.BanMembers, true)) {
            interaction.reply({ content:'You do not have premitions to unban members please check with and administrator if this is an error', ephemeral:true });

        }
        else {

            const perm = interaction.customId.split(' '),
                warnid = perm[2],
                targetid = perm[1];

            // console.log(warnid);
            // Delete warning
            warnings.removeById(warnid);

            // Unban members
            await interaction.guild?.bans.remove(targetid).catch(err => console.log(err));

            // Response message
            interaction.update({ embeds:[], components:[] });
        }
    },
};

export default button;