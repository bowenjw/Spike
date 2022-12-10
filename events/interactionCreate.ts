import {CommandInteraction, BaseInteraction, ButtonInteraction, Events} from 'discord.js';
import {button, Command, modal, selectMenu } from '../util/types';

export const name = Events.InteractionCreate,
once = false;

export async function execute(interaction: BaseInteraction ) {

	// interaction
	try {

		if (interaction.isCommand()) {
			console.log(`${interaction.user.tag} used ${interaction.commandName} from ${interaction.guild?.name}`);
			import(`../interactions/application_command/${interaction.commandName.toLowerCase()}`).then((obj:Command) => obj.commandExecute(interaction))
		}
		else if(interaction.isButton()) {
			const name = interaction.customId.split(' ')[0]
			console.log(`${interaction.user.tag} used ${name} button from ${interaction.guild?.name}`);
			import(`../interactions/button/${name}`).then((obj: button) => obj.buttomInteractionExecute(interaction))
		}

		else if(interaction.isAnySelectMenu()) {
			const name = interaction.customId.split(' ')[0]
			console.log(`${interaction.user.tag} used ${name} select menu from ${interaction.guild?.name}`);
			import(`../interactions/selectmenu/${name}`).then((obj: selectMenu) => obj.selectMenueInteractionExecute(interaction))
		}
		else if(interaction.isModalSubmit()) {
			const name = interaction.customId.split(' ')[0]
			console.log(`${interaction.user.tag} used ${name} model from ${interaction.guild?.name}`);
			import(`../interactions/modal/${name}`).then((obj: modal) => obj.modalInteractionExecute(interaction))
		}
			
	} catch (error: unknown) {
		console.log(error);
		if((interaction as ButtonInteraction).deferred){
			(interaction as CommandInteraction).followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else
			(interaction as CommandInteraction).reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}