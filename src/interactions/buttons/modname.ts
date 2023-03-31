import { ButtonInteraction, DiscordAPIError } from 'discord.js';
import { Interaction } from '../../classes/Interaction';

export default new Interaction<ButtonInteraction>()
    .setName('moderatename')
    .setExecute(async (interaction) => {
        const targetID = interaction.customId.split('_')[1];
        const member = interaction.guild.members.cache.find((_m, k) => k == targetID);
        if (!member) {
            interaction.reply({
                content: 'User is no longer in the server',
                ephemeral: true,
            });
        }
        else {
            member.setNickname('Nickname moderated', `${interaction.user.tag} moderated ${member.user.tag}'s nickname formarly ${member.nickname}`)
                .then(() => interaction.reply({
                    content: `${member}'s nickname has been moderated`,
                    ephemeral:true }))
                .catch((err) => {
                    if (!(err instanceof DiscordAPIError)) {
                        console.error(err);
                        return;
                    }
                    else if (err.code == 50013) {
                        interaction.reply({
                            content:`Bot does not have permissions to moderate the nickname of ${member}`,
                            ephemeral:true,
                        });
                    }
                });
        }
    });