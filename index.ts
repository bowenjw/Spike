import fs from 'fs';
import mongoose from 'mongoose';
import {Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
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
}),
	token = process.env.DISCORD_TOKEN!,
	applicationID = process.env.DISCORD_APPLICATION_ID!;

// Event file location
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.ts'));

//event handler
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	// console.log(event.name); // Loogs all Event files loaded
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to Discord with your client's token
client.login(token);