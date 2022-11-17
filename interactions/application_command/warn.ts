import { ChatInputCommandInteraction, ColorResolvable, CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandUserOption, TextChannel } from "discord.js";
import { Document, Types } from "mongoose";
import { guilds, ISystem } from "../../util/schema/guilds";
import { Iwarn } from "../../util/schema/warns";
import { renderWarnings, warnning } from "../../util/warnning";

const premission = PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageGuild,
userOption = new SlashCommandUserOption()
    .setName('target')
    .setDescription('User')
    .setRequired(true),
warnRemove = new SlashCommandSubcommandBuilder()
    .setName('remove')
    .setDescription('Remove warnning from user')
    .addStringOption(option => option
        .setName('id')
        .setDescription('The Id number for the warn')
        .setMaxLength(24)
        .setMinLength(24)
        .setRequired(true))
    .addBooleanOption(option => option
        .setName('delete')
        .setDescription('Permanently delete warnning from record')),
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
        .setDescription('Number of days, the warnning will last for')),
warnUpdate = new SlashCommandSubcommandBuilder()
    .setName('update')
    .setDescription('Update warnning')
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
    const config = await guilds.findOne({ guildId: interaction.guildId })
    if(!config?.warnSystem.enabled) {
        interaction.reply({
            content: 'Warnning Subsystem is disabled use </config system:1039674799120711781> to enable it',
            ephemeral: true
        });
        return;
    }
    console.log(config)
    if(interaction.isChatInputCommand()) {
        switch (interaction.options.getSubcommand(true)) {
            case 'add':
                await add(interaction, config?.warnSystem)
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

async function add(interaction: ChatInputCommandInteraction, config: ISystem) {
    let reason =  interaction.options.getString('reason'), color: ColorResolvable = "Yellow"
    const officer = interaction.user,
    target = interaction.options.getUser('target', true)

    if(target.bot || target == officer) {
        interaction.reply({ content:'Target can not be a bot or your self', ephemeral:true })
        return;
    }

    const records = await warnning.get(interaction.guildId!, target.id),
    length = records.length,
    record = await warnning.add(
        interaction.guildId!, 
        target.id, officer.id, 
        reason, null),
    exspiresAt = Math.floor(record.expireAt.getTime()/1000)

    if(reason == null)
        reason = 'No reason Given'

    if(records.length >= 2)
        color = 'Red'

    const embed = new EmbedBuilder()
        .setTitle('Warn')
        .setDescription(`**Reason:** ${reason}`)
        .setThumbnail(target.avatarURL())
        .setColor(color)
        .addFields(
            { name: 'Target', value: `${target.tag}\n${target}`, inline: true },
            { name: 'Officer', value: `${officer.tag}\n${officer}`, inline: true},
            { name: 'Expires', value: `<t:${exspiresAt}:R>\n <t:${exspiresAt}:F>`, inline: true})
        .setFooter({text: `ID: ${record._id}`})
        .setTimestamp(),
    channel = interaction.guild?.channels.cache.get(config.channel)! as TextChannel
    console.log(channel)
    interaction.reply({embeds:[embed], ephemeral:true})
    if(channel)
        channel.send({embeds:[embed]})
        
    let dmEmbed = new EmbedBuilder()
        
    if(length == 2) {
        dmEmbed = dmEmbed
            .setColor('Red')
            .setTitle(`You have been Banned from ${interaction.guild?.name}`)
            .setDescription(`After getting three active warnnings you are banned.\n**Reason:** ${reason}`)
        target.send({embeds:[dmEmbed]})
        interaction.guild?.members.ban(target).catch(err => console.log(err))
    } else {
        dmEmbed = dmEmbed
            .setTitle(`Warnning from ${interaction.guild?.name}`)
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
    let record:(Document<unknown, any, Iwarn> & Iwarn & {_id: Types.ObjectId;}) | null,
    content:string
    if(permDelete){
        record = await warnning.removeById(id, permDelete)
        content = `Warnning for <@${record?.userId}> has been deleted`
    } else {
        record = await warnning.removeById(id)
        content = `Warnning for <@${record?.userId}> has been removed`
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
    
    let records:(Document<unknown, any, Iwarn> & Iwarn & {_id: Types.ObjectId;})[]
    // console.log(months)
    if(months == null) {
        records = await warnning.get(guildId, target.id, date)
    } else if(months == 0) {
        records = await warnning.get(guildId, target.id)
    } else {
        date.setMonth(-months)
        records = await warnning.get(guildId, target.id, date)
    }
    interaction.reply(renderWarnings(records, target.id))
    
}

async function update(interaction: ChatInputCommandInteraction, config: ISystem) {
    const id = interaction.options.getString('id', true),
    reason = interaction.options.getString('reason', true),
    record = await warnning.updateById(id,reason,interaction.user.id),
    exspiresAt = Math.floor(record!.expireAt.getTime()/1000)
    const embed = new EmbedBuilder()
            .setTitle('Warn')
            .setDescription(`**Reason:** ${record?.reason}`)
            .setColor('Green')
            .addFields(
                { name: 'Target', value: `<@${record?.userId}>`, inline: true },
                { name: 'Officer', value: `<@${record?.officerId}>`, inline: true},
                { name: 'Expires', value: `<t:${exspiresAt}:R>\n <t:${exspiresAt}:F>`, inline: true})
            .setFooter({text: `ID: ${record?._id}`})
            .setTimestamp(record?.createdAt)
    interaction.reply({embeds:[embed]})
}