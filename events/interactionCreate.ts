import {CommandInteraction, BaseInteraction, ChatInputCommandInteraction, ButtonInteraction, ContextMenuCommandInteraction, Events} from 'discord.js';
import { Event, InteractionObj } from '../types';

export const name = Events.InteractionCreate,
once = false;

export async function execute(interaction: BaseInteraction | CommandInteraction | ChatInputCommandInteraction | ContextMenuCommandInteraction | ButtonInteraction) {
	// console.log(`${interaction.user.tag} in #${(interaction.channel as TextChannel).name} triggered an interaction.`);

	// Command interaction
	try {
		console.log(`${interaction.user.tag} used ${interaction.type} from ${interaction.guild?.name}`);

		let command:string | undefined = undefined
		console.log(typeof interaction)
		if (interaction.isCommand()) {
			command = `../interactions/application_command/${interaction.commandName}`
		}
		else if(interaction.isButton()) {
			command = `../interactions/button/${interaction.customId.split(' ')[0]}`
		}
		else if(interaction.isSelectMenu()) {
			command = `../interactions/selectmenu/${interaction.customId.split(' ')[0]}`
		}
		else if(interaction.isModalSubmit()) {
			command = `../interactions/modal/${interaction.customId.split(' ')[0]}`
		}
		if(command != undefined)
			import(command).then((obj:InteractionObj) => obj.execute(interaction))
	} catch (error: unknown) {
		console.log(error);
		if((interaction as CommandInteraction).deferred){
			(interaction as CommandInteraction).followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else
			(interaction as CommandInteraction).reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}

function interact(interaction:BaseInteraction) {
	switch (interaction.type) {
		case 2:
			break;
		case 3:
			break;
		case 5:
			break;
		default:
			break;
	}
}