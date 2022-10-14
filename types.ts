import { ButtonInteraction, CommandInteraction, ContextMenuCommandInteraction, ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, ModalSubmitInteraction, BaseInteraction } from "discord.js"

export interface Event {
    name: string,
    description?: string,
    once?: boolean,
    execute(...args: any[]): any,
}
export interface Interaction {
    name: string,
    description?: string,
    global?: boolean,
    execute(interaction: BaseInteraction): any
}
export interface Command extends Interaction {
    commandBuilder: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    execute(interaction: CommandInteraction): any
}

export interface Button extends Interaction {
    execute(interaction: ButtonInteraction): any
}
export interface ContextMenu extends Interaction {
    contextMenuBuilder: ContextMenuCommandBuilder,
    execute(interaction: ContextMenuCommandInteraction): any
}
export interface Modal extends Interaction {
    execute(interaction: ModalSubmitInteraction): any
}