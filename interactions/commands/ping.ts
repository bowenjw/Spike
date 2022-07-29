import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from 'discord.js';
import {client} from '../../client';
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
		
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		const embed = new EmbedBuilder()
			.setColor("Blurple")
			.setTitle('Ping!')
			.addFields(
				{ name: 'Command Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
				{ name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true })
			.setTimestamp();
		await interaction.followUp({
		//	content: ,
			ephemeral: true,
			embeds: [embed],
			components: [],
		});
	},
};