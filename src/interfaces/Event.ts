import { ClientEvents } from "discord.js";

export interface Event {
    name: keyof ClientEvents;
    once?: boolean;
    execute(...args: any[]): void;
}