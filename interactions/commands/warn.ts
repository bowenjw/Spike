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
                .setRequired(true))
            .addBooleanOption(option=>
                option.setName('silent')
                    .setDescription('hide warnning from users')))
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
        
        const target = interaction.options.getUser('user')!; // User is the target of the warn command
        
        if(/*interaction.options.getUser('user')?.id == interaction.user.id||*/ target.bot) {
            interaction.reply({content:'You can not warn your self', ephemeral:true})
            console.log(`${interaction.user.tag} tried to interat with them selfs`);
            return;
        }
        //await interaction.deferReply({ ephemeral: true });
        const options = interaction.options;
        const guild = interaction.guild!; // guild where the command came from
        const officer = interaction.member!; // user 
        const warnnings = await warnSchema.find({guildID: guild.id, userID: target.id });
        const length = warnnings.length;
        const subCommand = options.getSubcommand();
        
        let embed =  new MessageEmbed()
            .setTitle('Are You Sure?')
            .setThumbnail(target.avatarURL()!)
            .setColor('BLURPLE');
        let approvalbutton = new MessageButton()
            .setLabel('Yes')
            .setStyle('SUCCESS');
        let cancelButton = new MessageButton()
            .setCustomId(`warn cancel ${target.id}`)
            .setLabel('Cancel')
            .setStyle('DANGER');

        // remove subcommand
        if(options.getSubcommandGroup(false) == 'remove') {
            embed = embed.setDescription('You are about to remove the the Following warning(s)');
            
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

            const row = new MessageActionRow().addComponents([ approvalbutton, cancelButton]);
            interaction.reply({embeds: [embed], components:[row], ephemeral:true})
        } else if(subCommand == 'user') {
            if(options.getBoolean('silent')){
                approvalbutton = approvalbutton.setCustomId(`warn warnning ${target.id} silent`);
            } else {
                approvalbutton = approvalbutton.setCustomId(`warn warnning ${target.id}`);
            }
            
            const reason = interaction.options.getString('reason')!;
            const warnning = new warnSchema({ guildID: guild.id, userID: target.id, officerID: officer.user.id, reason: reason });
            
            warnning.save();
            
            const row = new MessageActionRow().addComponents([approvalbutton, 
                cancelButton.setCustomId(`warn cancel ${target.id} ${(warnSchema.findOne({guildID:guild.id,userID:target.id}) as any)._id}`)]);
            
                embed = embed.setDescription(`You are about to warn ${target}`)
                    .addFields(
                        {name:'Reason', value:reason, inline: true},
                        {name: 'Date', value:`<t:${Math.floor(new Date?.getTime() / 1000)}:f>`, inline:true},
                        {name:'Reporting Officer', value: `${officer}`, inline: true}        
                    );
            switch (length) {
                case 0:
                    embed = embed.setColor('GREEN');
                    break;
                case 1:                
                    embed = embed.setColor('YELLOW');
                    break;
                case 2:
                    embed = embed.setColor('RED')
                        .setTitle(`YOU ARE ABOUT TO BAN THIS USER`)
                        .setDescription(`${target} is about to recive theire threed warnning`);
                    break;
                default:
                    break;
            }            
            interaction.reply({embeds:[embed], components:[row], ephemeral: true});

        } else if(subCommand == 'history') { 
            // warn history
            let embed = new MessageEmbed()
                .setTitle('Warnning of History User')
                .setDescription(`Waring history of user ${target}.`)
                .setThumbnail(target.avatarURL()!)
                .setTimestamp();
            switch (length) {
                case 0:
                    embed = embed.setDescription(`User ${target} has not resvied any warnnings`)
                case 1:
                    embed = embed.setColor('GREEN');
                    break;
                case 2:
                    embed = embed.setColor('YELLOW');
                    break;
                case 3:
                    embed = embed.setColor('RED');
                    break;
                default:
                    break;
            }
            warnnings.reverse().forEach((warnning) => {
                embed = embed.addFields(
                    {name:'\u200b' ,value:'\u200b'},
                    {name:'Reason', value:warnning.reason, inline: true},
                    {name: 'Date', value:`<t:${Math.floor((warnning.createdAt as Date).getTime() / 1000)}:f>`, inline:true},
                    {name:'Reporting Officer', value: `${guild.members.cache.find(user => user.id == warnning.officerID)}`, inline: true}
                );
            });
            interaction.reply({embeds: [embed],ephemeral:true})
        }
	},
};