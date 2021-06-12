import {Client, Collection} from 'discord.js';
import { readdirSync } from 'fs';

/**
 * inits the event and command collections
 * @param {Client} client
 */
function handler_init(client){
    //This is used throughout discord.js rather than Arrays for anything that has an ID, for significantly improved performance and ease-of-use.
    client.commands = new Collection(); //A Map with the commands. 
    client.events = new Collection(); //A Map with the event methods. 
    command_handler(client)
    event_handler(client)
}

/**
 * 
 * @param {Client} client 
 */
function command_handler(client) {
const commandFiles = readdirSync('./bot/commands').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`../commands/${file}`);
		if(command.name) { client.commands.set(command.name, command); }
		else { continue; }
	}
}

/**
 * 
 * @param {Client} client 
 */
function event_handler(client){
   ['client', 'guild', 'message'].forEach(dirs => load_dir(dirs,client));
}
/**
 * 
 * @param {String [] } dirs 
 * @param {Client} client 
 */
function load_dir (dirs,client) {
    const event_files = readdirSync(`./bot/events/${dirs}`).filter(file => file.endsWith('.js'));
    for(const file of event_files) {
        const event = require(`../events/${dirs}/${file}`);
        const event_name = file.split('.')[0];
        try{
            client.on(event_name, event.bind(null, client));
        }catch(e){
            console.log(e)
        }
    }
};
export default handler_init