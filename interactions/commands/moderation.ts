import {CommandInteraction, ActionRow, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, CommandInteractionOptionResolver, SlashCommandUserOption} from 'discord.js';
import warnSchema from '../../schema/warnschema';
const builder = new SlashCommandBuilder()
    .setName('moderations')
    .setDescription('moderation')
    .addSubcommand(subcommand => 
        subcommand.setName('ban')
        .setDescription('ban member')
        .addUserOption(option => option.setName('member').setDescription('target member').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('use if is a tempban'))
        .addStringOption(option => option.setName('reason').setDescription('reason of ban or tempban')))
    .addSubcommandGroup(subcommandGroup =>
        subcommandGroup.setName('warn')
        .addSubcommand(subcommand => 
            subcommand.setName('new')
            .setDescription('warn member')
            .addUserOption(option => option.setName('member').setDescription('target member').setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand.setName('clear')
            .setDescription('clear warning(s)')
            .addUserOption(option => option.setName('member').setDescription('target member').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('view')
            .setDescription('view warnings of user')
            .addStringOption(option => option.setName('user_id').setDescription('User Discord id').setRequired(true)))),

function execute(interaction: CommandInteraction) {
    
    const officer = interaction.user;
    const target = interaction.options.getUser('user', true);
    const subcommand = interaction.options.getSubcommand(true)

    // Prevents interactions beetween bots and admins waing them selfs
    if (subcommand == 'history') {
        history(interaction)

    } else if(target.id == officer.id || target.bot) {
        interaction.reply({content:'You can not interact with that user', ephemeral:true})
        console.log(`${interaction.user.tag} tried to interat with them selfs or a bot`);
        return;

    } else if (subcommand == 'user') {
        user(interaction)

    } else if (subcommand == 'remove') {
        remove(interaction)
    }
}

async function user(interaction: CommandInteraction) {
    
    const officer = interaction.user,
        guild = interaction.guild!,
        options = interaction.options,
        target = options.getUser('user', true),
        silent = options.getBoolean('silent'),
        reason = options.getString('reason', true);

    let duration = options.getNumber('duration'),
        color:ColorResolvable = 'BLURPLE',
        title = 'Are You Sure?',
        label = 'Warn',
        customId = `warn warn`,
        description:string;

    // Exsiting Warning histroy
    const warnnings = await warningSchema.find({guildID: guild.id, userID: target.id, resovled: false, active: true}).gt('expireAt', new Date().setDate(new Date().getDate()-90)).limit(2);
    const length = warnnings.length;


    // Set the duration of the warnning in no option is given duation is set to 90 
    const date = new Date;
    if(!duration) {
        duration = 90;
    }
    date.setDate(date.getDate() + duration);
    
    //
    const warnning = new warningTemp({
        guildID: guild.id, 
        userID: target.id, 
        officerID: officer.id, 
        reason: reason,
        expireAt: date
    });
    await warnning.save()
    //console.log(warnning.id)
    customId +=' ' + warnning.id
    if(!silent || silent == null) {
        customId += ' false'
    } else {
        customId += ' true'
    }
    
    switch (length) {
        case 0:
            color ='GREEN'
            description = `This would be ${target}'s first warnning`;
            break;
        case 1:                
            color = 'YELLOW'
            description = `This would be ${target}'s Secound warnning`;
            break;
        case 2:
            color = 'RED'
            title = 'YOU ARE ABOUT TO BAN THIS USER'
            description = `${target} has recive two previous warnnings. This would be thier thred and Final warnning`;
            label = 'Ban'
            break;
        default:
            description = 'error'
            break;
    }
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .addField('Reason', reason)
        .setThumbnail(target.avatarURL()!)
        .setColor(color)
        .setTimestamp();

    const row = new MessageActionRow().addComponents([
        new MessageButton()
            .setCustomId(customId)
            .setLabel(label)
            .setStyle('DANGER'), 
        new MessageButton()
            .setCustomId(`warn cancel ${warnning.id}`)
            .setLabel('Cancel')
            .setStyle('SECONDARY')
    ]);

    interaction.reply({embeds: [embed], components: [row], ephemeral: true})

}

async function history(interaction: CommandInteraction){

    const guild = interaction.guild!;

    // Command Options
    const options = interaction.options;
    const target = options.getUser('user', true);
    const isActive = options.getBoolean('active') || false;

    const warnnings = await warningSchema.find({guildID: guild.id, userID: target.id, resovled: !isActive});
    const length = warnnings.length;
    
        
    // warn color
    let embed =  new MessageEmbed()
        .setTitle('Warnning of History User')
        .setThumbnail(target.avatarURL()!)
        .setColor('BLURPLE')
        .setTimestamp()

    if(length == 0) {
        embed = embed.setDescription(`User ${target} has not resvied any warnnings`)
            .setColor('GREEN');

    } else {
        embed = embed.setDescription(`Waring history of user ${target}.`);
    }
    if (length > 0)
        for (let count = 0; count < 2; count++) {
            
            const warnning = warnnings[count];

            if(count == 0) {
                embed = embed.addField('\u200b' ,'\u200b');
            }

            embed = embed.addFields(
                {name:'Reason', value: warnning.reason, inline:true},
                {name:'Date', value:`<t:${Math.floor((warnning.createdAt as Date).getTime() / 1000)}:f>`, inline:true},
                {name:'Reporting Officer', value: `${guild.members.cache.find(user => user.id == warnning.officerID)}`, inline:true}
            );
        }

    let row = new MessageActionRow().addComponents([new MessageButton()
            .setStyle('PRIMARY')
            .setLabel('Prev')
            .setCustomId(`warn next ${target}`)
            .setDisabled(true)

        , new MessageButton()
            .setStyle('PRIMARY')
            .setLabel('Next')
            .setCustomId(`warn next ${target} 3`)
            .setDisabled(length <= 3)
    ]);
    if(isActive) {
        interaction.reply({embeds:[embed], ephemeral:true})

    } else {
        interaction.reply({embeds:[embed], components:[row], ephemeral:true})
    }
}

function remove(interaction: CommandInteraction) {

}

export = {
    global: false,
	name: 'moderation',
	builder: builder,
	execute: execute,
}
