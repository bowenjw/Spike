/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ActionRowBuilder, ChatInputCommandInteraction, GuildMember, MessageActionRowComponentBuilder, PermissionsBitField, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandUserOption, TextChannel } from 'discord.js';
import { banDmEmbed, buttons, dmEmbed, removeWarnEmbed, viewWarningMessageRender, warnEmbedRender } from '../../features/warningRender';
import { guilds, warnings } from '../../schema';
import { ChatInputCommand, ISystem, IwarnningSystem } from '../../interfaces';
import { warningRecord } from '../../schema/warnings';

const userOption = new SlashCommandUserOption()
        .setName('target')
        .setDescription('User')
        .setRequired(true),

    duration = new SlashCommandIntegerOption()
        .setName('duration')
        .setDescription('Number of days, the warning till end of the warn')
        .setMinValue(0);

const command:ChatInputCommand = {
    options: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn Command')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addSubcommand(subCommand => subCommand
            .setName('remove')
            .setDescription('Remove warning from user')
            .addStringOption(option => option
                .setName('id')
                .setDescription('The Id number for the warn')
                .setMaxLength(24)
                .setMinLength(24)
                .setRequired(true))
            .addBooleanOption(option => option
                .setName('delete')
                .setDescription('Permanently delete warning from record')))
        .addSubcommand(subCommand => subCommand
            .setName('view')
            .setDescription('See warns of a user')
            .addUserOption(userOption)
            .addIntegerOption(option => option
                .setName('scope')
                .setDescription('scope of warning history')
                .addChoices(
                    { name: 'All', value: 0 },
                    { name: '3 Months', value: 3 },
                    { name: '6 Months', value: 6 },
                    { name: '9 Months', value: 9 },
                    { name: '1 year', value: 12 }))
            .addBooleanOption(option => option
                .setName('show')
                .setDescription('Show the view warns in the channel')))
        .addSubcommand(subCommand => subCommand
            .setName('add')
            .setDescription('Warn a user')
            .addUserOption(userOption)
            .addStringOption(option => option
                .setName('reason')
                .setDescription('Reason why member is warned')
                .setMaxLength(400))
            .addIntegerOption(duration)),
    global: true,
    execute:async (_client, interaction) => {
        const config = await guilds.get(interaction.guild!);
        if (!config?.warning.enabled) {
            interaction.reply({
                content: 'Warnning Subsystem is disabled use </config system:1039674799120711781> to enable it',
                ephemeral: true,
            });
            return;
        }
        // console.log(config)
        if (interaction.isChatInputCommand()) {
            const officer = interaction.member as GuildMember,
                target = interaction.options.getMember('target')! as GuildMember;

            if (target.user.bot || target == officer) {
                interaction.reply({ content:'Target can not be a bot or your self', ephemeral:true });
                return;
            }
            switch (interaction.options.getSubcommand(true)) {
            case 'add':
                await add(interaction, target!, officer, config?.warning);
                break;
            case 'remove':
                remove(interaction, config?.warning);
                break;
            case 'view':
                view(interaction, config?.warning);
                break;
            default:
                break;
            }
        }
    },
};

export default command;

async function add(interaction: ChatInputCommandInteraction, target:GuildMember, officer:GuildMember, config: IwarnningSystem) {
    if (target.permissions.has(PermissionsBitField.Flags.ManageGuild, true)) {
        interaction.reply({ content:'You can not warn this user bcaues that have `Manager Server` or `Administrator` permissions', ephemeral:true });
        return;
    }


    let reason:string | null | undefined = interaction.options.getString('reason'),
        days:number | null | undefined = interaction.options.getInteger('duration');

    // If reason is not given reason is set to undifined
    if (reason == null) { reason = undefined; }
    if (days == null) { days = undefined;}


    // exsitingWarns = await warnDB.find(interaction.guildId!, target.id),
    const newWarn = await warnings.create(interaction.guildId!, target.user, officer.user, reason, days),
        logChannel = interaction.guild?.channels.cache.get(config.channel!) as TextChannel,
        numberOfWarns = (await warnings.find(interaction.guildId!, target.id, new Date)).length,

        // Log Embed
        logEmbed = warnEmbedRender(newWarn, target.user),

        // Action Row
        viewWarnButton = buttons.viewWarnButton(target.id);


    // interaction reply
    interaction.reply({ embeds:[logEmbed], components:[new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(viewWarnButton)], ephemeral:true });


    const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttons.updateButton(newWarn), viewWarnButton);
    if (days != 0) {actionRow.addComponents(buttons.removeButton(newWarn));}
    // Message to log channel
    if (logChannel) { logChannel.send({ embeds:[logEmbed], components:[actionRow] });}

    const dm = dmEmbed(interaction, newWarn, numberOfWarns);
    // if user has gotten 3 active warnings and the most resent is not a 0 day warn and if they can be banned
    if (days != 0 && numberOfWarns >= config.maxActiveWarns && target.bannable && config.maxActiveWarns != 0) {
        reason = `Automatic action after ${config.maxActiveWarns} concurrent warnings`;
        await target.send({ embeds:[dm, banDmEmbed(interaction, reason, config.appealMessage)] });
        target.ban({ reason:reason });
    }
    else {
        target.send({ embeds:[dm] }).catch(err => console.log(err));
    }


}

async function remove(interaction: ChatInputCommandInteraction, config: ISystem) {

    const permDelete = interaction.options.getBoolean('delete'),
        id = interaction.options.getString('id', true);

    let status = 'Removed',
        record: warningRecord | null | undefined;

    if (permDelete && interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild, true)) {
        record = await warnings.removeById(id);
        status = 'Deleted';
    }
    else if (permDelete) {
        interaction.reply({ content:'You do not have the permission to delete warnings', ephemeral:true });
        return;

    }
    else { record = await warnings.updateById(id, interaction.user, undefined, 0); }

    if (record == null) {
        interaction.reply({ content:'Error recored not found', ephemeral:true });
        return;
    }

    const updateEmbed = removeWarnEmbed(record, status, interaction.user),
        row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttons.viewWarnButton(record.target.id));

    const channel = interaction.guild?.channels.cache.get(config.channel!) as TextChannel;
    if (channel) { channel.send({ embeds:[updateEmbed], components:[row] }).catch((err) => console.log(err)); }

    interaction.reply({ embeds:[updateEmbed], components:[row], ephemeral:true });


}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function view(interaction: ChatInputCommandInteraction, _config: ISystem) {
    const target = interaction.options.getUser('target', true),
        months = interaction.options.getInteger('scope'),
        guildId = interaction.guildId!,
        actionRow:ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
    let date:Date | undefined = new Date(),
        show:boolean | null | undefined = interaction.options.getBoolean('show');

    if (months == 0) {
        date = undefined;
    }
    else if (months != null) {
        date.setMonth(-months);
    }

    const records = await warnings.find(guildId, target.id, date);

    if (records.length == 0) {
        interaction.reply({ content:`${target} has no active warns or warns in the selected scope`, ephemeral:true });
        return;
    }
    else if (records.length > 3) {
        actionRow.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttons.leftButton(target.id), buttons.rightButton(target.id)));
    }

    if (show == null) { show = undefined; }

    interaction.reply({ embeds:viewWarningMessageRender(records), components:actionRow, ephemeral:!show });
}