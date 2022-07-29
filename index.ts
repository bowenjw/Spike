import fs from 'fs';
import mongoose from 'mongoose';
import {client} from './client';
// Conect to the Data Base
mongoose.connect(process.env.MONGO_URI!,{keepAlive:true})
	.then(() => console.log('Conected to DB\n'))
	.catch((err) => console.log(err));
	
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