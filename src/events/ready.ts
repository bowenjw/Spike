import { Client, Events } from 'discord.js';

export const name = Events.ClientReady,
    once = true
export function execute(client: Client) {
    console.log(`Ready! Logged in as ${client.user!.tag}`)
}

