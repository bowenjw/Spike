import {CommandInteraction, BaseInteraction, ChatInputCommandInteraction, ButtonInteraction, ContextMenuCommandInteraction} from 'discord.js';
import { Event, InteractionObj } from '../types';

const event: Event = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction: BaseInteraction | CommandInteraction | ChatInputCommandInteraction | ContextMenuCommandInteraction | ButtonInteraction) {
		// console.log(`${interaction.user.tag} in #${(interaction.channel as TextChannel).name} triggered an interaction.`);

		// Command interaction
		try {
			console.log(`${interaction.user.tag} used ${interaction.type} from ${interaction.guild?.name}`);

			let command:string | undefined = undefined
			if (interaction.isChatInputCommand()) {
				command = `../interactions/commands/${interaction.commandName}`
			}
			else if(interaction.isUserContextMenuCommand()) {
				command = `../interactions/usercontextmenu/${interaction.commandName}`
			}
			else if(interaction.isMessageContextMenuCommand()) {
				command = `../interactions/messagecontextmenu/${interaction.commandName}`
			}
			else if(interaction.isButton()) {
				command = `../interactions/button/${interaction.customId.split(' ')[0]}`
			}
			else if(interaction.isModalSubmit()) {
				command = `../interactions/modal/${interaction.customId.split(' ')[0]}`
			}
			if(command != undefined)
				import(command).then((obj:InteractionObj) => obj.execute(interaction))
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