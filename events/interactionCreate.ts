import {Interaction} from 'discord.js';
module.exports = {
	name: 'interactionCreate',
	async execute(interaction: Interaction) {
		console.log(`${interaction.user.tag} in ${interaction.channel} triggered an interaction.`);

		// Command interaction
		if (interaction.isCommand()) {
			const command = require(`../interactions/commands/${interaction.commandName}`);
			if (!command) return;
			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		/*	 else if (interaction.isButton()) {
			const command = require(`../commands/${interaction.customId}`);

			if (!command) return;

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		*/
		else if (interaction.isSelectMenu()) {
			const command = require(`../commands/menus/${interaction.customId}`);

			if (!command) return;

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};