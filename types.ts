import { ButtonInteraction, CommandInteraction, ContextMenuCommandInteraction, ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js"

export interface Event {
    name: string,
    description?: string,
    once?: boolean,
    execute(args:any): any,
}

export interface Command {
    name: string,
    description?: string,
    global: boolean,
    commandBuilder: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    execute(interaction: CommandInteraction): any
}

export interface Button {
    name: string,
    description?: string,
    execute(interaction: ButtonInteraction): any
}
export interface ContextMenu {
    name: string,
    description?: string
    contextMenuBuilder: ContextMenuCommandBuilder,
    execute(interaction: ContextMenuCommandInteraction): any
}