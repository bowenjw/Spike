import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';

import fs from 'fs';
import dotenv from 'dotenv';

import { Command } from './types'

dotenv.config();

// Place your client and guild ids here
const token = process.env.DISCORD_TOKEN;
const appid = process.env.APPLICATIONID;
const guildId = process.env.GUILDID;

const rest = new REST({ version: '10' }).setToken(token!);

function reloadedCommands() {

	console.log('Started refreshing application (/) commands.')

	rest.get(Routes.applicationCommands(appid!)).then((data:any) => removeCommands(data)).catch((err) => console.log(err));

	console.log('Successfully removed application (/) commands')

	addCommands();

	console.log('Successfully reloaded application (/) commands.');
}

function removeCommands(data: any) {
	
	const promises = [];

    for (const command of data) {
        const deleteUrl = Routes.applicationGuildCommand(appid!, guildId!,command.id);
        promises.push(rest.delete(`/${deleteUrl}`));
    }
    return Promise.all(promises);
	
}
async function addCommands() {

	const commandsFilePath = './interactions/commands/'
	const commands = [];
	const commandFiles = fs.readdirSync(commandsFilePath).filter(file => file.endsWith('.ts'));

	for (const file of commandFiles) {
		const command: Command = require(commandsFilePath + file);
		console.log(command.name)
		commands.push(command.SlashCommandBuilder.toJSON());
		console.log(`Loaded application (/) command ${command.name}.`)
	}

	await rest.put(
		Routes.applicationGuildCommands(appid!, guildId!),
		{ body: commands },
	);
}

export = reloadedCommands