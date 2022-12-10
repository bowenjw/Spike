import { ChatInputCommandInteraction, ColorResolvable, CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandUserOption, TextChannel, User } from "discord.js";
import { Document, Types } from "mongoose";
import { guildDB, ISystem } from "../../util/schema/guilds";
import { renderWarnings, warnDB, warningRecord } from "../../util/schema/warns";

const premission = PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageGuild,

userOption = new SlashCommandUserOption()
    .setName('target')
    .setDescription('User')
    .setRequired(true),

warnRemove = new SlashCommandSubcommandBuilder()
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
        .setDescription('Permanently delete warning from record')),

warnView = new SlashCommandSubcommandBuilder()
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
            { name: '1 year', value: 12 },
        )),

warnAdd = new SlashCommandSubcommandBuilder()
    .setName('add')
    .setDescription('Warn a user')
    .addUserOption(userOption)
    .addStringOption(option => option
        .setName('reason')
        .setDescription('Reason why member is warned')
        .setMaxLength(400))
    .addIntegerOption(option => option
        .setName('duration')
        .setDescription('Number of days, the warning will last for')),

warnUpdate = new SlashCommandSubcommandBuilder()
    .setName('update')
    .setDescription('Update warning')
    .addStringOption(option => option
        .setName('id')
        .setDescription('The Id number for the warn')
        .setMaxLength(24)
        .setMinLength(24)
        .setRequired(true))
    .addStringOption(option => option
        .setName('reason')
        .setDescription('Reason why member is warned')
        .setRequired(true)
        .setMaxLength(400))
        
export const slashCommandBuilder = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn Command')
    .setDMPermission(false)
    .setDefaultMemberPermissions(premission)
    .addSubcommand(warnRemove)
    .addSubcommand(warnView)
    .addSubcommand(warnAdd)
    .addSubcommand(warnUpdate)/**,
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
export async function commandExecute(interaction: CommandInteraction) {
    const config = await guildDB.get(interaction.guild!)
    if(!config?.warnSystem.enabled) {
        interaction.reply({
            content: 'Warnning Subsystem is disabled use </config system:1039674799120711781> to enable it',
            ephemeral: true
        });
        return;
    }
    // console.log(config)
    if(interaction.isChatInputCommand()) {
        const officer = interaction.user,
        target = interaction.options.getUser('target', true)

        if(target.bot || target == officer) {
            interaction.reply({ content:'Target can not be a bot or your self', ephemeral:true })
            return;
        }
        switch (interaction.options.getSubcommand(true)) {
            case 'add':
                await add(interaction, target, officer, config?.warnSystem)
                break;
            case 'remove':
                remove(interaction, config?.warnSystem)
                break;
            case 'view':
                view(interaction, config?.warnSystem)
                break;
            case 'update':
                update(interaction, config?.warnSystem)
                break;
            default:
                break;
        }
    }
}

async function add(interaction: ChatInputCommandInteraction, target:User, officer:User, config: ISystem) {
    
    let reason = interaction.options.getString('reason'),
    color: ColorResolvable = "Yellow"
    const exsitingWarns = await warnDB.get(interaction.guildId!, target.id),
    numberofWarns = exsitingWarns.length,
    newWarn = await warnDB.add(interaction.guildId!, target, officer, reason, null),
    exspiresAt = Math.floor(newWarn.expireAt.getTime()/1000);
    if(reason == null)
        reason = 'No reason Given'

    if(numberofWarns >= 2)
        color = 'Red'

    const embed = new EmbedBuilder()
        .setTitle('Warn')
        .setDescription(`**Reason:** ${reason}`)
        .setThumbnail(target.avatarURL())
        .setColor(color)
        .addFields(
            { name: 'Target', value: `${target}\n${target.tag}`, inline: true },
            { name: 'Officer', value: `${officer}\n${officer.tag}`, inline: true},
            { name: 'Expires', value: `<t:${exspiresAt}:R>\n <t:${exspiresAt}:F>`, inline: true})
        .setFooter({text: `ID: ${newWarn._id}`})
        .setTimestamp(),
    channel = interaction.guild?.channels.cache.get(config.channel) as TextChannel
    // console.log(channel)
    
    if(channel)
        channel.send({embeds:[embed]}).catch((err) => {console.log(err)})
    
    interaction.reply({embeds:[embed], ephemeral:true})
    
    let dmEmbed = new EmbedBuilder()

    if(length == 2) {
        dmEmbed = dmEmbed
            .setColor('Red')
            .setTitle(`You have been Banned from ${interaction.guild?.name}`)
            .setDescription(`After getting three active warnings you are banned.\n**Reason:** ${reason}`)
        target.send({embeds:[dmEmbed]})
        interaction.guild?.members.ban(target).catch(err => console.log(err))
    } else {
        dmEmbed = dmEmbed
            .setTitle(`Warning from ${interaction.guild?.name}`)
            .setDescription(`**Reason:** ${reason}`)
            .setColor('Yellow').addFields({
                name: 'About', 
                value:'Should you recive three(3) active warrning this will resalt in a ban', 
                inline:true
            })
        target.send({embeds:[dmEmbed]})
    }
}

async function remove(interaction: ChatInputCommandInteraction, config: ISystem) {
    const permDelete = interaction.options.getBoolean('delete'),
    id = interaction.options.getString('id',true)
    let content:string
    if(permDelete){
        const record = await warnDB.removeById(id, permDelete)
        content = `Warning for <@${record?.target.id}> has been deleted`
    } else {
        const record = await warnDB.removeById(id)
        content = `Warning for <@${record?.target.id}> has been removed`
    }
    interaction.reply({content:content, ephemeral:true})
    const channel = interaction.guild?.channels.cache.get(config.channel) as TextChannel
    if(channel)
        channel.send({content:'A ' + content.toLowerCase() + ` by ${interaction.user}`})
}

async function view(interaction: ChatInputCommandInteraction, config: ISystem) {
    const target = interaction.options.getUser('target',true),
        months = interaction.options.getInteger('scope'),
        guildId = interaction.guildId!,
        date = new Date()
    
    console.log(target)
    
    let records:warningRecord[]
    // console.log(months)
    if(months == null) {
        records = await warnDB.get(guildId, target.id, date)
    } else if(months == 0) {
        records = await warnDB.get(guildId, target.id)
    } else {
        date.setMonth(-months)
        records = await warnDB.get(guildId, target.id, date)
    }
    interaction.reply(renderWarnings(records, target))
    
}

async function update(interaction: ChatInputCommandInteraction, config: ISystem) {
    const id = interaction.options.getString('id', true),
    reason = interaction.options.getString('reason', true),
    record = await warnDB.updateById(id,reason,interaction.user.id),
    exspiresAt = Math.floor(record!.expireAt.getTime()/1000)
    const embed = new EmbedBuilder()
            .setTitle('Warn')
            .setDescription(`**Reason:** ${record?.reason}`)
            .setColor('Green')
            .addFields(
                { name: 'Target', value: `<@${record?.target.id}>`, inline: true },
                { name: 'Officer', value: `<@${record?.officer.id}>`, inline: true},
                { name: 'Expires', value: `<t:${exspiresAt}:R>\n <t:${exspiresAt}:F>`, inline: true})
            .setFooter({text: `ID: ${record?._id}`})
            .setTimestamp(record?.createdAt)
    interaction.reply({embeds:[embed]})
}