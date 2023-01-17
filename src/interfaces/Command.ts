import ExtendedClient from '../classes/ExtendedClient';
import { ChatInputCommandInteraction, CommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, MessageContextMenuCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, UserContextMenuCommandInteraction } from 'discord.js';

export interface Command {
    options: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | ContextMenuCommandBuilder,
    global: boolean,
    execute(client: ExtendedClient, interaction: CommandInteraction): void
}

export interface ChatInputCommand extends Command {
    options: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    execute(client: ExtendedClient, interaction: ChatInputCommandInteraction): void
}

export interface ContextMenu extends Command {
    options: ContextMenuCommandBuilder
    execute(client: ExtendedClient, interaction: ContextMenuCommandInteraction): void
}

export interface UserContextMenu extends ContextMenu {
    execute(client: ExtendedClient, interaction: UserContextMenuCommandInteraction): void
}

export interface MessageContextMenu extends ContextMenu {
    execute(client: ExtendedClient, interaction: MessageContextMenuCommandInteraction): void
}
