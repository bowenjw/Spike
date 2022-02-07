// eslint-disable-next-line no-unused-vars
const { Interaction } = require('discord.js');
module.exports = {
	name: 'interactionCreate',
	/**
     *
     * @param {Interaction} interaction
     * @returns
     */
	async execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

		// Command interaction
		if (interaction.isCommand()) {
			const command = require(`../commands/${interaction.commandName}`);

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
