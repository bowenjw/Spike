// eslint-disable-next-line no-unused-vars
const { SelectMenuInteraction, Role } = require('discord.js');
module.exports = {
	/**
     *
     * @param {SelectMenuInteraction} interaction
     */
	async execute(interaction) {
		const memberRoles = interaction.member.roles;
		const component = interaction.component;
		const values = interaction.values;
		const removed = component.options.filter((option) => {
			return !values.includes(option.value);
		});
		for (const role of removed) {
			memberRoles.remove(role.value);
		}
		for (const role of values) {
			memberRoles.add(role);
		}
		await interaction.reply({
			content: 'Your role has been updated',
			ephemeral: true,
		});
	},
};