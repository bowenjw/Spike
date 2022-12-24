import { 
    AnySelectMenuInteraction,
    ButtonInteraction,
    CommandInteraction,
    ContextMenuCommandBuilder,
    ModalSubmitInteraction,
    SlashCommandBuilder 
} from "discord.js"

export interface Event {
    name: string,
    description?: string,
    once?: boolean,
    execute(...args: any[]): any,
}

export interface Command {
    userContextMenuCommand?: ContextMenuCommandBuilder,
    messageContextMenuCommand?: ContextMenuCommandBuilder,
    slashCommandBuilder?: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
    commandExecute(interaction: CommandInteraction): any
}

interface interaction {
    customId: string
}

export interface button extends interaction {
    buttonInteractionExecute(interaction: ButtonInteraction): any
}

export interface selectMenu extends interaction {
    selectMenueInteractionExecute(interaction: AnySelectMenuInteraction): any
}

export interface modal extends interaction {
    modalInteractionExecute(interaction: ModalSubmitInteraction): any
}

export enum Fetures {
    Timeout = 0,
    Warn = 1
}