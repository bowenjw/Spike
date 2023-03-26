import { GuildMember, Snowflake, StringSelectMenuInteraction } from 'discord.js';
import { Interaction } from '../../classes/Interaction';
import { Alignment, alignmentMenu, Notifications, notificationsMenu, pronounMenu, Pronouns, Religon, religonMenu } from '../../features/roles';

const pronoun:Snowflake[] = [Pronouns.He, Pronouns.She, Pronouns.They, Pronouns.Any, Pronouns.Ask],
    religon:Snowflake[] = [Religon.Atheist, Religon.Buddhist, Religon.Christian, Religon.Eastern_Orthodox,
        Religon.Hindu, Religon.Jew, Religon.Muslim, Religon.Pagan, Religon.Satanist, Religon.Taoist],
    notifications:Snowflake[] = [Notifications.Server_Events, Notifications.Server_Updates, Notifications.Streams_video],
    alignment:Snowflake[] = [Alignment.Left, Alignment.Left_center, Alignment.Center, Alignment.Right_center, Alignment.Right];

export default new Interaction<StringSelectMenuInteraction>()
    .setName('roles')
    .setExecute(async (interaction) => {
        let promis:Promise<GuildMember | undefined> | undefined = undefined,
            // eslint-disable-next-line @typescript-eslint/ban-types
            menu:Function | undefined;
        const args = interaction.customId.split('_');
        switch (args[1]) {
        case 'n':
            promis = role(interaction.values, notifications, interaction);
            menu = notificationsMenu;
            break;
        case 'p':
            promis = role(interaction.values, pronoun, interaction);
            menu = pronounMenu;
            break;
        case 'r':
            promis = role(interaction.values, religon, interaction);
            menu = religonMenu;
            break;
        case 'a':
            promis = role(interaction.values, alignment, interaction);
            menu = alignmentMenu;
            break;
        default:
            break;
        }
        if (promis) {
            promis.then(member => {
                if (member && menu) {
                    interaction.update({
                        components:[menu(member.roles), interaction.message.components[1]] });
                }
            });
        }
    });
async function role(newRoles:string[], list:string[], interaction:StringSelectMenuInteraction) {
    if (!(interaction.member instanceof GuildMember)) { return; }
    const old = list.filter(r => !newRoles.includes(r));
    return interaction.member.roles.remove(old).then(m => m.roles.add(newRoles));
}