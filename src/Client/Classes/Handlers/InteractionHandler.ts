import {
	AnySelectMenuInteraction, ButtonInteraction, Collection, ModalSubmitInteraction
} from 'discord.js';
import { ExtendedClient } from '../ExtendedClient';
import { Interaction } from '../Interaction';

export class InteractionHandler {
	protected readonly client: ExtendedClient;

	// Collection of Button Interactions
	readonly buttons: Collection<string, Interaction<ButtonInteraction>> = new Collection();

	// Collection of Select Menu Interactions
	readonly selectMenus: Collection<string, Interaction<AnySelectMenuInteraction>> = new Collection();

	// Collection of Modal Submit Interactions
	readonly modals: Collection<string, Interaction<ModalSubmitInteraction>> = new Collection();
	
	addButton(interaction: Interaction<ButtonInteraction>) {
		this.buttons.set(interaction.name, interaction);
		return this;
	}

	addButtons(collection: Collection<string, Interaction<ButtonInteraction>>) {
		this.buttons.concat(collection);
		return this;
	}

	runButton(interaction: ButtonInteraction){
		const interactionName = this.client.splitCustomID ? interaction.customId.split(this.client.splitCustomIDOn)[0] : interaction.customId;
		return this.buttons.get(interactionName).execute(interaction);
	}

	addModal(interaction: Interaction<ModalSubmitInteraction>) {
		this.modals.set(interaction.name, interaction);
		return this;
	}

	addModals(collection: Collection<string, Interaction<ModalSubmitInteraction>>) {
		this.modals.concat(collection);
		return this;
	}

	runModal(interaction: ModalSubmitInteraction){
		const interactionName = this.client.splitCustomID ? interaction.customId.split(this.client.splitCustomIDOn)[0] : interaction.customId;
		return this.modals.get(interactionName).execute(interaction);
	}

	addSelectMenu(interaction: Interaction<AnySelectMenuInteraction>) {
		this.selectMenus.set(interaction.name, interaction);
		return this;
	}
	
	addSelectMenus(collection: Collection<string, Interaction<AnySelectMenuInteraction>>) {
		this.selectMenus.concat(collection);
		return this;
	}

	runSelectMenus(interaction: AnySelectMenuInteraction){
		const interactionName = this.client.splitCustomID ? interaction.customId.split(this.client.splitCustomIDOn)[0] : interaction.customId;
		return this.selectMenus.get(interactionName).execute(interaction);
	}

	constructor(client: ExtendedClient) {
		this.client = client;
	}
}
