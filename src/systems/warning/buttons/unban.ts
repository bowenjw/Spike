import { ButtonInteraction, GuildMember, PermissionsBitField } from 'discord.js';
import { warningDb } from '../warn-schema';

export async function unban(interaction:ButtonInteraction) {
    const { member, guild, customId, client } = interaction;
    const officer = member instanceof GuildMember ? member : guild.members.cache.get(member.user.id);

    if (!officer.permissions.has(PermissionsBitField.Flags.BanMembers, true)) {
        interaction.reply({ content: 'You do not have premitions to unban members please check with and administrator if this is an error', ephemeral: true });
    }
    else {
        const prems = customId.split(client.splitCustomIDOn);
        const record = await warningDb.getWarnById(client, prems[1]);

        await Promise.all([
            // Delete warning
            record.setNewEndDate(new Date, officer).save(),
            guild.bans.remove(prems[2]).catch(err => console.log(err)),
            // Response message
            interaction.update({ embeds: [], components: [] }),
        ]);
        return;
    }
}
