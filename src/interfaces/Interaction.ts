import { BaseInteraction } from "discord.js";

export interface Interaction {
    name: string;
    execute(interaction: BaseInteraction): Promise<void>;
}