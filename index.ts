import fs from 'fs';
import mongoose from 'mongoose';
import {Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { putCommands } from './interactions/applicationCommands';
import { Event } from './types';
// Conect to the Data Base
// mongoose.connect(process.env.MONGO_URI!,{keepAlive:true})
//	.then(() => console.log('Conected to DB\n'))
//	.catch((err) => console.log(err));

dotenv.config();
// Create a new client instance
export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});
const token = process.env.DISCORD_TOKEN!;
// Event file location
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.ts'));

//event handler
for (const file of eventFiles) {
	import(`./events/${file}`).then((event:Event) => {
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		}
		else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	})
}

// Login to Discord with your client's token
client.login(token);