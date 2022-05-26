import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Guild, MessageActionRow, MessageButton, MessageEmbed, User } from 'discord.js';
import warnSchema from '../../schema/warnschema';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Three Strike System')
        
        .addSubcommand(subcommand=>
            // warn user - command issues warning to user
            subcommand.setName('user')
            .setDescription('Warn user')
            .addUserOption(option=>
                option.setName('user')
                .setDescription('Taget user')
                .setRequired(true))
            .addStringOption(option=>
                option.setName('reason')
                .setDescription('Why user was warned')
                .setRequired(true)))
    
        .addSubcommand(subcommand=>
            // warn history - command show shitory of user
            subcommand.setName('history')
            .setDescription('get user history')
            .addUserOption(option=>
                option.setName('user')
                .setDescription('Taget user')
                .setRequired(true)))

        .addSubcommandGroup(subCommandGroup=>
            //warn remove - command sub group
            subCommandGroup.setName('remove')
            .setDescription('remove warnning(s)')

            .addSubcommand(subCommand=>
                //warn remove latest - command removes only the latest warning
                subCommand.setName('latest')
                    .setDescription('removes only the latest warning')
                    .addUserOption(option=>
                        option.setName('user')
                        .setDescription('Taget user')
                        .setRequired(true)))
            .addSubcommand(subCommand=>
                //warn remove all - command removes all warnings
                subCommand.setName('all')
                    .setDescription('removes all warnings')
                    .addUserOption(option=>
                        option.setName('user')
                        .setDescription('Taget user')
                        .setRequired(true)))),
    
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

        const target = interaction.options.getUser('user')!; // User is the target of the warn command
        const guild = interaction.guild!; // guild where the command came from
        const officer = interaction.member!; // user 
        const warnnings = await warnSchema.find({guildID: guild.id, userID: target.id });
        const length = warnnings.length;
        const subCommand = interaction.options.getSubcommand();
        
        let embed =  new MessageEmbed()
            .setTitle('Are You Sure?')
            .setThumbnail(target.avatarURL()!)
            .setColor('BLURPLE');
        let approvalbutton = new MessageButton()
        .setLabel('Yes')
        .setStyle('SUCCESS');
        // remove subcommand
        if(interaction.options.getSubcommandGroup(false) == 'remove') {
            embed = embed.setDescription('You are about to remove the the Following warning(s)');
            
            if(isUser(interaction) || target.bot) {
                console.log(`${interaction.user.tag} you can not interact with this user`)
                return;
            }
            if(subCommand == 'all') {
                warnnings.reverse().forEach((warnning)=>{
                    embed = embed.addFields(
                        {name:'\u200b' ,value:'\u200b'},
                        {name:'Reason', value:warnning.reason, inline: true},
                        {name: 'Date', value:`<t:${Math.floor((warnning.createdAt as Date).getTime() / 1000)}:f>`, inline:true},
                        {name:'Reporting Officer', value: `${guild.members.cache.find(user => user.id == warnning.officerID)}`, inline: true}
                    );
                });
                approvalbutton = approvalbutton.setCustomId(`warn deleteAll ${target.id} `);  
            } else if(subCommand == 'latest') {
                embed = embed.addFields(
                    {name:'Reason', value:warnnings[length-1].reason, inline: true},
                    {name: 'Date', value:`<t:${Math.floor((warnnings[length-1].createdAt as Date).getTime() / 1000)}:f>`, inline:true},
                    {name:'Reporting Officer', value: `${guild.members.cache.find(user => user.id == warnnings[length-1].officerID)}`, inline: true});
                    approvalbutton = approvalbutton.setCustomId(`warn deleteOne ${target.id} ${warnnings[length-1]._id}`);
            }
            const row = new MessageActionRow()
                .addComponents([ approvalbutton,
                    new MessageButton()
                        .setCustomId(`warn cancel ${target.id}`)
                        .setLabel('Cancel')
                        .setStyle('DANGER')
                ]);
            interaction.followUp({embeds: [embed], components:[row], ephemeral:true})
        } else if(subCommand == 'user') {
            const reason = interaction.options.getString('reason')!;
                const warnning = new warnSchema({
                    guildID: guild.id,
                    userID: target.id,
                    officerID: officer.user.id,
                    reason: reason
                });
            
                await warnning.save();
                //target.send({content: `You have recived a warnning from ${guild.name}`});
                interaction.followUp({content:`${target} has recived a warnning`, ephemeral: true});

        } else if(subCommand == 'history') {
            if(length == 0){
                const embed = new MessageEmbed()
                    .setTitle('Warnning of History User')
                    .setDescription(`User ${target} has not resvied any warnnings`)
                    .setColor('BLURPLE')
                    .setThumbnail(target.avatarURL()!)
                    .setTimestamp();
                interaction.followUp({embeds: [embed], ephemeral:true})
            } else {
                let embed = new MessageEmbed()
                .setTitle('Warnning of History User')
                .setDescription(`Waring history of user ${target}.`)
                .setThumbnail(target.avatarURL()!)
                .setColor('BLURPLE')
                .setTimestamp();
                warnnings.reverse().forEach((warnning)=>{
                    embed = embed.addFields(
                        {name:'\u200b' ,value:'\u200b'},
                        {name:'Reason', value:warnning.reason, inline: true},
                        {name: 'Date', value:`<t:${Math.floor((warnning.createdAt as Date).getTime() / 1000)}:f>`, inline:true},
                        {name:'Reporting Officer', value: `${guild.members.cache.find(user => user.id == warnning.officerID)}`, inline: true}
                    );
                });
                interaction.followUp({embeds: [embed],ephemeral:true})
            }
        }
	},
};

function isUser(interaction:CommandInteraction):Boolean {
    if(interaction.options.getUser('user')?.id == interaction.user.id){
        interaction.followUp({content:'You can not warn your self',ephemeral:true})
        return true;
    }
    return false;
}