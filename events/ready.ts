import { Client, Events } from 'discord.js';
import { putCommands } from "../interactions/applicationCommands";

export const name = Events.ClientReady,
once = true;

export function execute(client: Client) {
	console.log(`\nReady! Logged in as ${client.user!.tag}`);
	putCommands()
}