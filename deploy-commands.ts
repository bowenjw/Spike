import fs from 'fs';
import dotenv from 'dotenv';
import {SlashCommandBuilder} from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

dotenv.config();

interface Icommand {
	data: SlashCommandBuilder
}

// Place your client and guild ids here
const token = process.env.DISCORD_TOKEN;
const appid = process.env.APPLICATIONID;
const guildId = process.env.GUILDID;

const rest = new REST({ version: '9' }).setToken(token!);

// Removes exsiting commands
try {
	// Remove gobal commands
	rest.get(Routes.applicationCommands(appid!))
	.then((data:any) => {
		const promises = [];
		for (const command of data) {
			const deleteUrl = Routes.applicationCommand(appid!, command.id);
			promises.push(rest.delete(`/${deleteUrl}`));
		}
		return Promise.all(promises);
	});
	// Remove guild commands
	rest.get(Routes.applicationGuildCommands(appid!, guildId!))
    .then((data:any) => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = Routes.applicationGuildCommand(appid!, guildId!,command.id);
            promises.push(rest.delete(`/${deleteUrl}`));
        }
        return Promise.all(promises);
    }).then( async () => { // Added New commands

		const commands = [];
		const commandFiles = fs.readdirSync('./interactions/commands').filter(file => file.endsWith('.ts'));
		
		for (const file of commandFiles) {
			const command:Icommand = require(`./interactions/commands/${file}`);
			commands.push(command.data.toJSON());
		}
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			Routes.applicationGuildCommands(appid!, guildId!),
			{ body: commands },
		);
		console.log('Successfully reloaded application (/) commands.');
	});
	
} catch (error) {
	console.log(error);
};