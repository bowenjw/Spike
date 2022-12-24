import { Client, Events } from 'discord.js';
import deploy from '../features/deploy';
import { client as bot } from '../bot';


export const name = Events.ClientReady,
once = true;
export async function execute(client: Client) {
    await deploy(bot);
	console.log(`\nReady! Logged in as ${client.user!.tag}`);
}

