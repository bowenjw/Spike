import {CommandInteraction, GuildChannel, BaseInteraction, ChatInputCommandInteraction, ButtonInteraction, ContextMenuCommandInteraction} from 'discord.js';
import { runApplicationCommand } from '../interactions/applicationCommands';
import { Event } from '../types';

const event: Event = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction: BaseInteraction | CommandInteraction | ChatInputCommandInteraction | ContextMenuCommandInteraction | ButtonInteraction) {
		// console.log(`${interaction.user.tag} in #${(interaction.channel as TextChannel).name} triggered an interaction.`);

		// Command interaction
		try {
			console.log(`${interaction.user.tag} used ${interaction.type} from ${interaction.guild?.name} in channel ${(interaction.channel as GuildChannel).name}`);
			runApplicationCommand(interaction);
		} catch (error: unknown) {
			console.error(error);
			if((interaction as CommandInteraction).deferred){
				(interaction as CommandInteraction).followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else
				(interaction as CommandInteraction).reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}

export = event;