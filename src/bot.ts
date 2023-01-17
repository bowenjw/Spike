import { GatewayIntentBits as Intents } from 'discord.js';
import ExtendedClient from './classes/ExtendedClient';
import { config } from 'dotenv';
import mongoose from 'mongoose';

// Load .env file contents
config();

// Initialization (specify intents and partials)
new ExtendedClient({
    intents: [
        Intents.Guilds,
        Intents.GuildMembers,
        Intents.GuildMessages,
        Intents.GuildVoiceStates,
        Intents.MessageContent,
    ],
}).login(process.env.TOKEN);

// Mongoose
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
mongoose.connect(process.env.MONGO_URI!);
mongoose.set('strictQuery', false);