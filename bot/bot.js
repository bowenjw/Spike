
/**
 * @description Main for a Discord bot using Discord.js
 * @author John W. Bowen
 */
import { Client } from 'discord.js';
import handler_init from './handlers';

const client = new Client(); //The main hub for interacting with the Discord API, and the starting point for any bot.

handler_init(client);

client.login(); //Logs the client in, establishing a websocket connection to Discord.
export default client;