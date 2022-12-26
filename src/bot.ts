import { GatewayIntentBits as Intents } from 'discord.js';
import ExtendedClient from './classes/ExtendedClient';
import { config } from 'dotenv';
import mongoose from 'mongoose';

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
mongoose.connect(process.env.MONGO_URI!)
mongoose.set('strictQuery', false)