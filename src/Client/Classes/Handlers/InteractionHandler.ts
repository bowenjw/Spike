import { AnySelectMenuInteraction, ButtonInteraction, Collection, ModalSubmitInteraction } from 'discord.js';
import { Interaction } from '../Interaction';
import { BaseHandler } from './baseHandler';

export class InteractionHandler extends BaseHandler {

    // Collection of Button Interactions
    protected _buttons: Collection<string, Interaction<ButtonInteraction>> = new Collection();

    // Collection of Select Menu Interactions
    protected _selectMenus: Collection<string, Interaction<AnySelectMenuInteraction>> = new Collection();

    // Collection of Modal Submit Interactions
    protected _modals: Collection<string, Interaction<ModalSubmitInteraction>> = new Collection();

    get buttons() {
        return this._buttons;
    }

    get selectMenus() {
        return this._selectMenus;
    }

    get modals() {
        return this._modals;
    }

    /**
     * Add a button interaction to the handler
     * @param button The button interaction to add
     * @returns The command handler
     */
    addButton(button: Interaction<ButtonInteraction>) {
        this._buttons.set(button.name, button);
        return this;
    }

    /**
     * Add a buttons interaction to the handler
     * @param buttons The buttons interaction to add
     * @returns The command handler
     */
    addButtons(buttons: Collection<string, Interaction<ButtonInteraction>>) {
        this._buttons = this._buttons.concat(buttons);
        return this;
    }

    /**
     * Get and run a button interaction based on the interation event
     * @param button The button interaction event
     * @returns The command handler
     */
    runButton(button: ButtonInteraction) {
        const interactionName = this.client.splitCustomID ? button.customId.split(this.client.splitCustomIDOn)[0] : button.customId;
        return this._buttons.get(interactionName).execute(button);
    }

    addModal(interaction: Interaction<ModalSubmitInteraction>) {
        this._modals.set(interaction.name, interaction);
        return this;
    }

    addModals(collection: Collection<string, Interaction<ModalSubmitInteraction>>) {
        this._modals = this._modals.concat(collection);
        return this;
    }

    runModal(interaction: ModalSubmitInteraction) {
        const interactionName = this.client.splitCustomID ? interaction.customId.split(this.client.splitCustomIDOn)[0] : interaction.customId;
        return this._modals.get(interactionName).execute(interaction);
    }

    addSelectMenu(interaction: Interaction<AnySelectMenuInteraction>) {
        this._selectMenus.set(interaction.name, interaction);
        return this;
    }

    addSelectMenus(collection: Collection<string, Interaction<AnySelectMenuInteraction>>) {
        this._selectMenus = this._selectMenus.concat(collection);
        return this;
    }

    runSelectMenus(interaction: AnySelectMenuInteraction) {
        const interactionName = this.client.splitCustomID ? interaction.customId.split(this.client.splitCustomIDOn)[0] : interaction.customId;
        return this._selectMenus.get(interactionName).execute(interaction);
    }
}
