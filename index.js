require('dotenv').config();
const { Client, Intents } = require('discord.js');
const fs = require('fs');
const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Login to Discord with your client's token
client.login(token);

// Event file location
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

//  Events handler
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
module.exports = client;