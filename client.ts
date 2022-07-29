import {Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

// Create a new client instance
export const client = new Client({ intents: [GatewayIntentBits.Guilds]});

dotenv.config();


// Login to Discord with your client's token
const token = process.env.DISCORD_TOKEN;
client.login(token);