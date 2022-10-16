import { Client } from 'discord.js';
import { putCommands } from "../interactions/applicationCommands";
import { Event } from '../types'

const event: Event = {
	name: 'ready',
	once: true,
	execute(client: Client) {
		console.log(`\nReady! Logged in as ${client.user!.tag}`);
		putCommands()
	}
};
export = event;