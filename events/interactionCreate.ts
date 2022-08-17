import {CommandInteraction, GuildChannel, BaseInteraction, ChannelType, ChatInputCommandInteraction, ButtonInteraction, ContextMenuCommandInteraction} from 'discord.js';
import { Event, Command, ContextMenu, Button } from '../types';

const event: Event = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction: BaseInteraction | CommandInteraction| ChatInputCommandInteraction | ContextMenuCommandInteraction | ButtonInteraction) {
		// console.log(`${interaction.user.tag} in #${(interaction.channel as TextChannel).name} triggered an interaction.`);

		// Command interaction
		try {
			console.log(`${interaction.user.tag} used Button from ${interaction.guild?.name} in channel ${(interaction.channel as GuildChannel).name}`);
			if(interaction.channel?.type == ChannelType.DM) {
				return;
			} else if (interaction.isChatInputCommand()) {
				const command: Command = await require(`../interactions/commands/${interaction.commandName}`);
				command.execute(interaction);
			}
			else if(interaction.isButton()) {
				const command: Button = await require(`../interactions/buttons/${interaction.customId.split(' ')[0]}`);
				command.execute(interaction);
			}
			else if(interaction.isContextMenuCommand()) {
				const command: ContextMenu = await require(`../interactions/contextmenu/${interaction.commandName}`);
				command.execute(interaction);
			}
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