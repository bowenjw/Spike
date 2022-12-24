import { CommandInteraction, ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";

export interface Command {
    userContextMenuCommand?: ContextMenuCommandBuilder,
    messageContextMenuCommand?: ContextMenuCommandBuilder,
    slashCommandBuilder?: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
    global: Boolean,
    execute(interaction: CommandInteraction): Promise<void>
}