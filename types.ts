import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders"
import { ButtonInteraction, CommandInteraction } from "discord.js"

export interface Event {
    name: string,
    description?: string,
    once?: boolean,
    execute(args:any): any,
}

export interface Command {
    name: string,
    description?: string,
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    execute(interaction: CommandInteraction): any
}

export interface Button {
    name: string,
    description?: string,
    execute(interaction: ButtonInteraction): any
}