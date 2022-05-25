import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Guild, MessageActionRow, MessageButton, MessageEmbed, User } from 'discord.js';
import warnSchema from '../../schema/warnschema';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Three Strike System')
        .addSubcommand(subcommand=>
            subcommand.setName('user')
            .setDescription('Warn user')
            .addUserOption(option=>
                option.setName('user')
                .setDescription('Taget user')
                .setRequired(true))
            .addStringOption(option=>
                option.setName('reason')
                .setDescription('Why user was warned')
                .setRequired(false)))
        .addSubcommand(subcommand=>
            subcommand.setName('history')
            .setDescription('get user history')
            .addUserOption(option=>
                option.setName('user')
                .setDescription('Taget user')
                .setRequired(true)))
        .addSubcommand(subCommand=>
            subCommand.setName('remove-latest')
            .setDescription('remove warnning')
            .addUserOption(option=>
                option.setName('user')
                .setDescription('Taget user')
                .setRequired(true))),
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

        const target = interaction.options.getUser('user')!;
        const guild = interaction.guild!;
        const officer = interaction.member!;
        const warnnings = await warnSchema.find({guildID: guild.id, userID: target.id });
        const length = warnnings.length;
        // console.log(warnnings);
        // console.log(warnnings.length == 0);
        
        if(interaction.options.getSubcommand() == 'user') {
            if(target.id == interaction.user.id){
                interaction.followUp({content:'You can not warn your self',ephemeral:true})
            } else {
                    const reason = interaction.options.getString('reason')!;
                let warnning;
                if(reason) {
                    warnning = new warnSchema({
                        guildID: guild.id,
                        userID: target.id,
                        officerID: officer.user.id,
                        reason: reason
                    });
                } else {
                    warnning = new warnSchema({
                        guildID: guild.id,
                        userID: target.id,
                        officerID: officer.user.id,
                    });
                }
            
                await warnning.save()

                target.send({content: `You have recived a warnning from ${guild.name}`})
                interaction.followUp({content:`${target} has recived a warnning`, ephemeral: true})
            }
        
        } else if(interaction.options.getSubcommand() == 'history') {
            
            if(length == 0){
                const embed = new MessageEmbed()
                    .setTitle('Warnning of History User')
                    .setDescription(`User ${target} has not resvied any warnnings`)
                    .setColor('BLURPLE')
                    .setThumbnail(target.avatarURL()!)
                    .setTimestamp();
                interaction.followUp({embeds: [embed], ephemeral:true})
            } else {
                interaction.followUp({embeds: [embed(warnnings, target, guild)],ephemeral:true})
            }
        
        } else {
            // console.log(warnnings[length-1])
            const embed = new MessageEmbed()
            .setTitle('Are You Sure?')
            .addFields(
                {name:'Reason', value:warnnings[length-1].reason, inline: true},
                {name: 'Date', value:`<t:${Math.floor((warnnings[length-1].createdAt as Date).getTime() / 1000)}:f>`, inline:true},
                {name:'Reporting Officer', value: `${guild.members.cache.find(user => user.id == warnnings[length-1].officerID)}`, inline: true}
            )
            .setThumbnail(target.avatarURL()!)
            .setColor('BLURPLE');
            const row = new MessageActionRow()
                .addComponents([
                    new MessageButton()
                        .setCustomId(`warndelete y ${target.id} ${warnnings[length-1]._id}`)
                        .setLabel('Yes')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId(`warndelete n ${target.id}`)
                        .setLabel('Exit')
                        .setStyle('DANGER')
                ]);
            interaction.followUp({embeds: [embed], components:[row], ephemeral:true})
        }
	},
};

function embed(warnnings: any[] , target: User, guild:Guild ):MessageEmbed {
    let embed = new MessageEmbed()
        .setTitle('Warnning of History User')
        .setDescription(`Waring history of user ${target}. oldest to newest`)
        .setThumbnail(target.avatarURL()!)
        .setColor('BLURPLE')
        .setTimestamp();
    let number = warnnings.length;
    warnnings.reverse().forEach((warnning)=>{
        embed = embed.addField('\u200b', '\u200b');
        if(warnning.reason) {
            embed = embed.addFields(
                {name:'Reason', value:warnning.reason, inline: true},
                {name: 'Date', value:`<t:${Math.floor((warnning.createdAt as Date).getTime() / 1000)}:f>`, inline:true},
                {name:'Reporting Officer', value: `${guild.members.cache.find(user => user.id == warnning.officerID)}`, inline: true}
            );
        } else {
            embed = embed.addFields(
                {name:'Reason', value:'no reason given', inline: true},
                {name: 'Date', value:`<t:${Math.floor((warnning.createdAt as Date).getTime() / 1000)}:f>`, inline:true},
                {name:'Reporting Officer', value: `${guild.members.cache.find(user => user.id == warnning.officerID)}`, inline: true}
            );
        }
    });
    return embed;
}