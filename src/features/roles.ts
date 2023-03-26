import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMemberRoleManager, MessageActionRowComponentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

/* eslint-disable no-shadow */
export enum Pronouns {
    He = '833864460543721487',
    She = '833864263083753504',
    They = '833864491610406932',
    Any = '966529942424785016',
    Ask = '1089357395735629954',
}

export enum Religon {
    Atheist = '1069517079876731040',
    Buddhist = '1069517511055392838',
    Christian = '1069517677149827112',
    Eastern_Orthodox = '1082779358156050574',
    Hindu = '1069517846020890684',
    Jew = '1069518219154571294',
    Muslim = '1069518058667905084',
    Pagan = '1069518388805775400',
    Satanist = '1069546957342777354',
    Taoist = '1069539068695805982',
}

export enum Notifications {
    Server_Events = '1005283785341927494',
    Server_Updates = '1021503884813926460',
    Streams_video = '1049523932174229624'
}

export enum Alignment {
    Left = '1003800881751408721',
    Left_center = '1048954477354438686',
    Center = '837104691174572073',
    Right_center = '1048954558665216061',
    Right = '1003800906451664987'
}

export function religonMenu(roles:GuildMemberRoleManager) {
    // console.log(roles);
    return new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(new StringSelectMenuBuilder()
            .setCustomId('roles_r')
            .setPlaceholder('Religon')
            .setOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue(Religon.Atheist)
                    .setEmoji('⚛️')
                    .setLabel('Atheist')
                    .setDefault(roles.cache.has(Religon.Atheist)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Religon.Buddhist)
                    .setEmoji('☸️')
                    .setLabel('Buddhist')
                    .setDefault(roles.cache.has(Religon.Buddhist)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Religon.Christian)
                    .setEmoji('✝️')
                    .setLabel('Christian')
                    .setDefault(roles.cache.has(Religon.Christian)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Religon.Hindu)
                    .setEmoji('🕉️')
                    .setLabel('Hindu')
                    .setDefault(roles.cache.has(Religon.Hindu)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Religon.Jew)
                    .setEmoji('🕉️')
                    .setLabel('Jew')
                    .setDefault(roles.cache.has(Religon.Jew)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Religon.Pagan)
                    .setEmoji('1069554009452597330')
                    .setLabel('Pagan')
                    .setDefault(roles.cache.has(Religon.Pagan)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Religon.Satanist)
                    .setEmoji('1069552860855013416')
                    .setLabel('Satanist')
                    .setDefault(roles.cache.has(Religon.Satanist)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Religon.Taoist)
                    .setEmoji('☯️')
                    .setLabel('Taoist')
                    .setDefault(roles.cache.has(Religon.Taoist)),
            )
            .setMinValues(0)
            .setMaxValues(1),
        );
}
export function pronounMenu(roles:GuildMemberRoleManager) {
    return new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(new StringSelectMenuBuilder()
            .setCustomId('roles_p')
            .setPlaceholder('Pronouns')
            .setMinValues(1)
            .setMaxValues(5)
            .setOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue(Pronouns.He)
                    .setEmoji('❤️')
                    .setLabel('He / Him')
                    .setDefault(roles.cache.has(Pronouns.He)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Pronouns.She)
                    .setEmoji('💙')
                    .setLabel('She / Her')
                    .setDefault(roles.cache.has(Pronouns.She)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Pronouns.They)
                    .setEmoji('💚')
                    .setLabel('They / Them')
                    .setDefault(roles.cache.has(Pronouns.They)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Pronouns.Any)
                    .setEmoji('💛')
                    .setLabel('Any Pronouns')
                    .setDefault(roles.cache.has(Pronouns.Any)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Pronouns.Ask)
                    .setEmoji('🧡')
                    .setLabel('Other / Ask')
                    .setDefault(roles.cache.has(Pronouns.Ask)),
            ),
        );
}
export function notificationsMenu(roles:GuildMemberRoleManager) {
    return new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(new StringSelectMenuBuilder()
            .setCustomId('roles_n')
            .setPlaceholder('Notifications')
            .setMinValues(0)
            .setMaxValues(3)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue(Notifications.Server_Events)
                    .setEmoji('📅')
                    .setLabel('Server Events')
                    .setDescription('Get ping for Game nights and other events')
                    .setDefault(roles.cache.has(Notifications.Server_Events)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Notifications.Server_Updates)
                    .setEmoji('🛠️')
                    .setLabel('Server Updates')
                    .setDescription('Get ping when we announce changes to the server')
                    .setDefault(roles.cache.has(Notifications.Server_Updates)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Notifications.Streams_video)
                    .setEmoji('🎬')
                    .setLabel('Videos and Streams')
                    .setDescription('Get pings for when Hunter goes live')
                    .setDefault(roles.cache.has(Notifications.Streams_video),
                    ),
            ),
        );
}
export function alignmentMenu(roles:GuildMemberRoleManager) {
    return new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(new StringSelectMenuBuilder()
            .setCustomId('roles_a')
            .setPlaceholder('Political Alignment')
            .setMinValues(0)
            .setMaxValues(1)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue(Alignment.Left)
                    .setEmoji('🟦')
                    .setLabel('Left')
                    .setDefault(roles.cache.has(Alignment.Left)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Alignment.Left_center)
                    .setEmoji('🔵')
                    .setLabel('Moderate Left')
                    .setDefault(roles.cache.has(Alignment.Left_center)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Alignment.Center)
                    .setEmoji('🟣')
                    .setLabel('Center')
                    .setDefault(roles.cache.has(Alignment.Center)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Alignment.Right_center)
                    .setEmoji('🔴')
                    .setLabel('Moderate Right')
                    .setDefault(roles.cache.has(Alignment.Right_center)),
                new StringSelectMenuOptionBuilder()
                    .setValue(Alignment.Right)
                    .setEmoji('🟥')
                    .setLabel('Right')
                    .setDefault(roles.cache.has(Alignment.Right)),
            ),
        );
}
export function roleButton(state:number) {
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
            new ButtonBuilder()
                .setCustomId('roles_note')
                .setLabel('Notifications')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('roles_pronoun')
                .setLabel('Pronoun')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('roles_align')
                .setLabel('Alignment')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('roles_religon')
                .setLabel('Religon')
                .setStyle(ButtonStyle.Secondary),
        ]);
    row.components[state].setDisabled(true).setStyle(ButtonStyle.Primary);
    return row;
}