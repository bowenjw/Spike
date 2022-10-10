import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Amputator } from '../../system/Amputator';
import { Command } from '../../types';
const command: Command = {
	name: 'amputator',
	description: 'Get non AMP versions of we sites',
	global: true,
	commandBuilder: new SlashCommandBuilder()
		.setName('amputator')
		.setDescription('Get non AMP versions of websites')
		.setDMPermission(true)
        .addStringOption(option => option
            .setName("link")
            .setDescription("Link to AMPed webstie")
            .setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
        const regLink = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
            link = interaction.options.getString("link",true);
        if(!regLink.test(link)) {
            interaction.reply({content: 'Please provide a link starting with `https://`', ephemeral: true});
            return;
        }
        interaction.deferReply({ephemeral: true})
        // console.log(deampLink);
        interaction.followUp({content: `${await Amputator(link)}`, ephemeral: true})
		//const newLink = await deAmp(link)
	},
}
export = command;