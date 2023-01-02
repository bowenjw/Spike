import { Events, InteractionType, ApplicationCommandType, ComponentType, Interaction } from 'discord.js';
import { Icommand, Iinteraction } from '../interfaces';
import { client } from '../bot';
import path from 'path';

export const name = Events.InteractionCreate,
once = false


export async function execute(interaction: Interaction ) {
	console.log(interaction)
	let interactionName:string
	switch (interaction.type) {
		case InteractionType.ApplicationCommand:
			switch (interaction.commandType) {
				case ApplicationCommandType.ChatInput:
					client.commands.get(interaction.commandName)?.execute(interaction)
					break;
				case ApplicationCommandType.Message:
				case ApplicationCommandType.User:
					client.contextMenus.get(interaction.commandName)?.execute(interaction)
					break;
				default:
					break;
			}
			break;
		case InteractionType.MessageComponent:
			interactionName = interaction.customId.split(' ')[0]
			switch (interaction.componentType) {
				case ComponentType.Button:
					client.buttons.get(interactionName)?.execute(interaction)
					break;
				case ComponentType.ChannelSelect:
				case ComponentType.RoleSelect:
				case ComponentType.MentionableSelect:
				case ComponentType.StringSelect:
					client.selectMenus.get(interactionName)?.execute(interaction)
					break;

				default:
					break;
			}

			break;
		case InteractionType.ModalSubmit:
			interactionName = interaction.customId.split(' ')[0]
			client.modals.get(interactionName)?.execute(interaction)
			break;
		default:
			break;
	}
}