const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { CommandInteraction, MessageEmbed } = require('discord.js');
const client = require('../index');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const embed = new MessageEmbed()
			.setColor('BLURPLE')
			.setTitle('Ping!')
			.addFields(
				{ name: 'Command Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
				{ name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true })
			.setTimestamp();
		interaction.followUp({
		//	content: ,
			ephemeral: true,
			embeds: [embed],
			components: [],
		});
	},
};