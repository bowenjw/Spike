import { Client } from 'discord.js';
import { registerGlobalCommands } from "../interactions/command";
import { Event } from '../types'

const event: Event = {
	name: 'ready',
	once: true,
	execute(client: Client) {
		//reloadedCommands()
		console.log(`\nReady! Logged in as ${client.user!.tag}`);
		registerGlobalCommands();
	}
};
export = event;