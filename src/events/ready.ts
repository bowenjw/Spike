import { Client, Events } from 'discord.js';
import { client as bot } from '../bot';
import { deploy } from '../features';

export const name = Events.ClientReady,
    once = true
export function execute(client: Client) {
    deploy(bot);
    console.log(`Ready! Logged in as ${client.user!.tag}`)
}

