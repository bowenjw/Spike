import {
    DiscordAPIError, Events, Interaction,
} from 'discord.js';
import { Event } from '../Classes/Event';

export default new Event()
    .setName(Events.InteractionCreate)
    .setExecute(onInteractionCreate);

async function onInteractionCreate(interaction: Interaction) {
    const { commandHandler, interactionHandler } = interaction.client;
    try {
        // Runs if slash commands
        if (interaction.isChatInputCommand()) {
            await commandHandler.runChatCommand(interaction);
        }
        // Runs if context commands
        else if (interaction.isContextMenuCommand()) {
            await commandHandler.runContextCommand(interaction);
        }
        // Runs if slash commands option autocomplete
        else if (interaction.isAutocomplete()) {
            const autocomplete = commandHandler.chatCommands.get(interaction.commandName)?.autocomplete;
            if (!autocomplete) {
                console.warn(`Autocomplete for ${interaction.commandName} was not Setup`);
            }
            else {
                await autocomplete(interaction);
            }
        }
        // Runs if select menu
        else if (interaction.isAnySelectMenu()) {
            await interactionHandler.runSelectMenus(interaction);
        }
        // Runs if button
        else if (interaction.isButton()) {
            await interactionHandler.runButton(interaction);
        }
        // Runs if model
        else if (interaction.isModalSubmit()) {
            await interactionHandler.runModal(interaction);
        }
    }
    catch (error) {
        // Checks if the interaction is repiliable
        if (interaction.isRepliable()) {
            // If the error is from the discord api is is logged
            if (error instanceof DiscordAPIError) {
                console.error(error);
            }
            else if (error instanceof Error) {
                console.error(error);
                // Check if client is set to not send reply on error
                if (!interaction.client.replyOnError) return;

                const errorMessage = 'There was an error while executing this interaction.';

                // Check if interaction was deferred
                if (interaction.deferred) {
                    // If defered interactions is followed up
                    await interaction.followUp({ content: errorMessage, ephemeral: true }).catch((e) => console.error(e));
                }
                else {
                    // Else the interactions is replied to
                    await interaction.reply({ content: errorMessage, ephemeral: true }).catch((e) => console.error(e));
                }
            }
        }
        // If the interaction can not be repliyed to the error is logged
        else {console.error(error);}
    }
}
