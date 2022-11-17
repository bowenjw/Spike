import {CommandInteraction, BaseInteraction, ButtonInteraction, Events} from 'discord.js';
import {button, Command, modal, selectMenue } from '../util/types';

export const name = Events.InteractionCreate,
once = false;

export async function execute(interaction: BaseInteraction ) {

	// interaction
	try {
		
		console.log(`${interaction.user.tag} used ${interaction.type} from ${interaction.guild?.name}`);

		if (interaction.isCommand())
			import(`../interactions/application_command/${interaction.commandName.toLowerCase()}`).then((obj:Command) => obj.commandExecute(interaction))

		else if(interaction.isButton())
			import(`../interactions/button/${interaction.customId.split(' ')[0]}`).then((obj: button) => obj.buttomInteractionExecute(interaction))

		else if(interaction.isSelectMenu())
			import(`../interactions/selectmenu/${interaction.customId.split(' ')[0]}`).then((obj: selectMenue) => obj.selectMenueInteractionExecute(interaction))

		else if(interaction.isModalSubmit())
			import(`../interactions/modal/${interaction.customId.split(' ')[0]}`).then((obj: modal) => obj.modalInteractionExecute(interaction))
			
	} catch (error: unknown) {
		console.log(error);
		if((interaction as ButtonInteraction).deferred){
			(interaction as CommandInteraction).followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else
			(interaction as CommandInteraction).reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}