import { ButtonInteraction, EmbedBuilder, GuildMember, PermissionsBitField } from "discord.js";
import { warnings } from "../../schema";


export const name = 'unban'

export async function execute(interaction:ButtonInteraction) {
    const user = interaction.member as GuildMember
    if(!user?.permissions.has(PermissionsBitField.Flags.BanMembers, true)){
        interaction.reply({content:'You do not have premitions to unban members please check with and administrator if this is an error', ephemeral:true})

    } else {

        const perm = interaction.customId.split(' '),
        warnid = perm[2],
        targetid = perm[1]

        console.log(warnid)
        warnings.removeById(warnid) // Delete warning
        
        await interaction.guild?.bans.remove(targetid).catch(err => console.log(err)) // Unban members

        interaction.update({embeds:[], components:[]}) // Response message
    }
}