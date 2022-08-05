import { Client } from 'discord.js';
import { reloadedCommands } from '../deploy-commands';
import { Event } from '../types'

export const event: Event = {
	name: 'ready',
	once: true,
	execute(client: Client) {
		//reloadedCommands()
		console.log(`\nReady! Logged in as ${client.user!.tag}`);
		
	}
};