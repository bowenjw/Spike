import { Interaction } from "discord.js";

export interface Iinteraction {
    name: string;
    execute(interaction: Interaction): void;
}