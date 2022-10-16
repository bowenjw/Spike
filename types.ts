import { BaseInteraction, ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js"

export interface Event {
    name: string,
    description?: string,
    once?: boolean,
    execute(...args: any[]): any,
}
export interface InteractionObj {
    execute(interaction: BaseInteraction): any
}
export interface CommandInteractionObj extends InteractionObj  {
    builder: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | ContextMenuCommandBuilder
}