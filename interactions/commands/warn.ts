import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
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
                    .setDescription('hide warnning from users'))
            .addNumberOption(option =>
                option.setName('duration')
                    .setDescription('Number of day that the warning will last')
                    .setMinValue(0)))
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
        // Options
        const options = interaction.options;
        const subCommand = options.getSubcommand();
        const silent = options.getBoolean('silent');
        const target = options.getUser('user')!; // User is the target of the warn command
        // interaction properties
        const guild = interaction.guild!; // guild where the command came from
        const officer = interaction.user!; // user

        // Exsiting  wranings
        const warnnings = await warnSchema.find({guildID: guild.id, userID: target.id });
        const length = warnnings.length;
        
        // Base Conferamtion embed
        let embed =  new MessageEmbed()
            .setTitle('Are You Sure?')
            .setThumbnail(target.avatarURL()!)
            .setColor('BLURPLE')
            .setTimestamp();

        // Yes button Base Element
        let approvalbutton = new MessageButton()
            .setLabel('Yes')
            .setStyle('SUCCESS');

        // No Button Base Element
        let cancelButton = new MessageButton()
            .setCustomId(`warn cancel ${target.id}`)
            .setLabel('Cancel')
            .setStyle('DANGER');

        // subGomandGroup remove
        if(options.getSubcommandGroup(false) == 'remove') {
            // Officer can not interact with bot or them self
            if(target.id == officer.id || target.bot) {
                interaction.reply({content:'You can not interact with that user', ephemeral:true})
                console.log(`${interaction.user.tag} tried to interat with them selfs or a bot`);
                return;
            }
            
            embed = embed.setDescription('You are about to remove the the Following warning(s)');
            if(subCommand == 'latest') {
                
                approvalbutton = approvalbutton.setCustomId(`warn deleteOne ${target.id} ${warnnings[length-1]._id}`);

                embed = embed.addFields(
                    {name:'Reason', value:warnnings[length-1].reason, inline: true},
                    {name:'Date', value:`<t:${Math.floor((warnnings[length-1].createdAt as Date).getTime() / 1000)}:f>`, inline:true},
                    {name:'Reporting Officer', value:`${guild.members.cache.find(user => user.id == warnnings[length-1].officerID)}`, inline:true}
                );
            
            } else { //reomve all warnings
                
                approvalbutton = approvalbutton.setCustomId(`warn deleteAll ${target.id} `); 

                warnnings.reverse().forEach((warnning)=>{
                    embed = embed.addFields(
                        {name:'\u200b' ,value:'\u200b'},
                        {name:'Reason', value:warnning.reason, inline: true},
                        {name: 'Date', value:`<t:${Math.floor((warnning.createdAt as Date).getTime() / 1000)}:f>`, inline:true},
                        {name:'Reporting Officer', value: `${guild.members.cache.find(user => user.id == warnning.officerID)}`, inline: true}
                    );
                });
            }

            const row = new MessageActionRow().addComponents([ approvalbutton, cancelButton]);
            // remove reply
            interaction.reply({embeds: [embed], components:[row], ephemeral:true})

        } else if(subCommand == 'user'){
            // Officer can not interact with bot or them self
            if(target.id == officer.id || target.bot) {
                interaction.reply({content:'You can not interact with that user', ephemeral:true})
                console.log(`${interaction.user.tag} tried to interat with them selfs or a bot`);
                return;
            }
            
            if(silent) {
                approvalbutton = approvalbutton.setCustomId(`warn warnning ${target.id} ${length} silent`);
            } else {
                approvalbutton = approvalbutton.setCustomId(`warn warnning ${target.id} ${length}`);
            }
            const date = new Date;
            let days = 90;
            const durationOption = options.getNumber('duration');
            if(durationOption) {
               days = durationOption;
            }
            date.setDate(date.getDate() + days);
            
            const reason = options.getString('reason')!;
            const warnning = new warnSchema({
                guildID: guild.id, 
                userID: target.id, 
                officerID: officer.id, 
                reason: reason,
                expireAt: date
            });

            warnning.save();

            embed = embed.addField('Reason',reason);

            switch (length) {
                case 0:
                    embed = embed.setColor('GREEN')
                        .setDescription(`This would be ${target}'s first warnning`);
                    break;
                case 1:                
                    embed = embed.setColor('YELLOW')
                        .setDescription(`This would be ${target}'s Secound warnning`);
                    break;
                case 2:
                    embed = embed.setColor('RED')
                        .setTitle(`YOU ARE ABOUT TO BAN THIS USER`)
                        .setDescription(`${target} has recive two previous warnnings. This would be thier thred and Final warnning`);
                    break;
                default:
                    break;
            }
            // confrimation buttons
            const row = new MessageActionRow().addComponents([approvalbutton, 
                cancelButton.setCustomId(`warn cancel ${target.id} ${(warnSchema.findOne({guildID:guild.id,userID:target.id}) as any)._id}`)]);
            
                interaction.reply({embeds:[embed], components:[row], ephemeral: true});
        } else if(subCommand == 'history') { 
            // warn history
            embed = embed.setTitle('Warnning of History User')
                .setDescription(`Waring history of user ${target}.`);
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
            let first = true;
            warnnings.reverse().forEach((warnning) => {
                if(!first) {
                    embed = embed.addField('\u200b' ,'\u200b');
                }
                embed = embed.addFields(
                    {name:'Reason', value:warnning.reason, inline:true},
                    {name:'Date', value:`<t:${Math.floor((warnning.createdAt as Date).getTime() / 1000)}:f>`, inline:true},
                    {name:'Reporting Officer', value: `${guild.members.cache.find(user => user.id == warnning.officerID)}`, inline:true}
                );
                first = false;
            });
            interaction.reply({embeds:[embed], ephemeral:true})
        }
	},
};