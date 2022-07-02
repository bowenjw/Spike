import dotenv from 'dotenv';
import fs from 'fs';
import {Client, Intents} from 'discord.js';
import mongoose from 'mongoose';

dotenv.config();

// Conect to the Data Base
mongoose.connect(process.env.MONGO_URI!,{keepAlive:true})
	.then(() => console.log('Conected to DB\n'))
	.catch((err) => console.log(err));
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS]});

const token = process.env.DISCORD_TOKEN;

// Login to Discord with your client's token
client.login(token);

// Event file location
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.ts'));

//event handler
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// exports client
export default client;