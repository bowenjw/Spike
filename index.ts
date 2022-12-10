import fs from 'fs';
import { connect } from 'mongoose';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv'
import { Event } from './util/types';
// Conect to the Data Base
// mongoose.connect(process.env.MONGO_URI!,{keepAlive:true})
//	.then(() => console.log('Conected to DB\n'))
//	.catch((err) => console.log(err));

config();

// Create a new client instance
export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const token = process.env.DISCORD_TOKEN!,

// Event file location
eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.ts'));

//event handler
eventFiles.forEach((fileName) => {
	import(`./events/${fileName}`).then((event:Event) => {
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args))
		} else {
			client.on(event.name, (...args) => event.execute(...args))
		}
	})
})

connect(process.env.MONGO_URI!)

// Login to Discord with your client's token
client.login(token);