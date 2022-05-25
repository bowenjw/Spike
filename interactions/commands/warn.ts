import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, User } from "discord.js";
import mongoose from "mongoose";
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
                .setRequired(true)))
        .addSubcommand(subcommand=>
            subcommand.setName('history')
            .setDescription('get user history')
            .addUserOption(option=>
                option.setName('user')
                .setDescription('Taget user')
                .setRequired(true)))
        .addSubcommand(subCommand=>
            subCommand.setName('remove')
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
        const warnnings = await find(guild.id, target.id);

        if(interaction.commandName = 'user') {
            const reason = interaction.options.getString('reason')!;
            const warnning = new warnSchema({
                guildID: guild.id,
                userID: target.id,
                officerID: officer.user.id,
                reason: reason
            })
            await warnning.save()
            target.send({content: ''})
            interaction.followUp({content:`${target} has recived a warnning`, ephemeral: true})
        } else if(interaction.commandName = 'history') {
            embed(warnnings, target)
            console.log(warnnings);
        } else {
            
        }
	},
};


function find(guildID:string, userID:string) {
    return warnSchema.find({guildID: guildID, userID: userID })
}
function embed(warnnings: any[] , target: User ):MessageEmbed {
    let embed = new MessageEmbed()
        .setTitle('Report')
        .setDescription('Report of user warnings')
        .addField('User',`${target}`)
    
    return embed;
}