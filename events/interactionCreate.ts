import {CommandInteraction, Interaction, TextChannel} from 'discord.js';
module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction: Interaction) {
		console.log(`${interaction.user.tag} in #${(interaction.channel as TextChannel).name} triggered an interaction.`);

		// Command interaction
		try {
			if (interaction.isCommand()) {
				//console.log(interaction.commandName);
				const command = await require(`../interactions/commands/${interaction.commandName}`);
				await command.execute(interaction);
			}
			else if(interaction.isButton()) {

			}
			
		} catch (error: unknown) {
			console.error(error);
			await (interaction as CommandInteraction).reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
};