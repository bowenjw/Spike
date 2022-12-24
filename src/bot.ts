import { GatewayIntentBits as Intents } from 'discord.js';
import ExtendedClient from './classes/Client';
import { config } from 'dotenv';
import { connect, set } from 'mongoose';

// Load .env file contents
config();

// Initialization (specify intents and partials)
export const client = new ExtendedClient({
    intents: [
        Intents.Guilds,
        Intents.GuildMembers,
        Intents.GuildVoiceStates
    ]
})

client.init()

// Mongoose
connect(process.env.MONGO_URI!)
set('strictQuery', false)