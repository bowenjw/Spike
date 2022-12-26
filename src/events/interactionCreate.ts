import { Events, InteractionType, ApplicationCommandType, ComponentType, Interaction } from 'discord.js';
import { Icommand, Iinteraction } from '../interfaces';
import { client } from '../bot';
import path from 'path';

export const name = Events.InteractionCreate,
once = false


export async function execute(interaction: Interaction ) {

	switch (interaction.type) {
		case InteractionType.ApplicationCommand:
			console.log(`${interaction.user.tag} used ${interaction.commandName} from ${interaction.guild?.name}`);
			switch (interaction.commandType) {
				case ApplicationCommandType.ChatInput:
					client.commands.get(interaction.commandName)?.execute(interaction)
					break;

				case ApplicationCommandType.Message:
				case ApplicationCommandType.User:
					client.contextMenus.get(interaction.commandName)?.execute(interaction)
					break;

				default:
					console.error('Application Command Not Supported')
					break;
			}
			break;
		// Message Component and Models
		case InteractionType.MessageComponent:
		case InteractionType.ModalSubmit:
			const name = interaction.customId.split(' ')[0]
			console.log(`${interaction.user.tag} used ${name} button from ${interaction.guild?.name}`);
			client.interactions.get(name)?.execute(interaction)
			break;
		default:
			console.error('Interaction Type Not Supported')
			break;
	}
}