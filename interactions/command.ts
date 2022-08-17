import { REST } from '@discordjs/rest';
import { GuildResolvable, RESTGetAPIApplicationCommandsResult, RESTPatchAPIApplicationCommandJSONBody, RESTPostAPIApplicationCommandsJSONBody, Routes, Snowflake } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import { Command, ContextMenu } from '../types'
import { client } from '../client';

dotenv.config();

const BaseFilePath = './interactions',
token = process.env.DISCORD_TOKEN!,
appId = process.env.APPLICATIONID!,
// guildId = process.env.GUILDID!,
rest = new REST({ version: '10' }).setToken(token);

export async function putGlobalCommands() {
    const newCommands = await getcommandJSONs();
    putCommands(newCommands);
}

async function getcommandJSONs() {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [],
    chatCommands = fs.readdirSync(`${BaseFilePath}/commands`).filter(file => file.endsWith('.ts')),
    contextMenuCommands = fs.readdirSync(`${BaseFilePath}/contextmenu`).filter(file => file.endsWith('.ts'))

    // console.log(files); // loges command files read
    for (const file of chatCommands) {
        const command: Command = await require(`../${BaseFilePath}/commands/${file}`);
        commands.push(command.commandBuilder.toJSON());
    }
    for (const file of contextMenuCommands) {
        const command: ContextMenu = await require(`../${BaseFilePath}/contextmenu/${file}`);
        commands.push(command.contextMenuBuilder.toJSON());
    }
    return commands;
}
/**
 * 
 * @param appId Application ID
 * @param commands command that will be
 * @param guildId guild id if guild command
 */
async function putCommands(commands:RESTPostAPIApplicationCommandsJSONBody[], guildId?: Snowflake) {
    
    const route = await getRoute(appId, guildId);
    
    try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(route, { body: commands }).then( () => console.log('Successfully reloaded application (/) commands.'));

		
	} catch (error) {
		console.error(error);
	}
}
/**
 * 
 * @param appId Application ID
 * @param guildId guild id if guild command
 * @returns 
 */
async function getRoute(appId:Snowflake, guildId?: Snowflake) {
    let route = Routes.applicationCommands(appId);
    if(guildId) {
        await client.guilds.fetch({cache: true, force: false, guild: guildId, withCounts: false}).then(async (guild) => {
            if(guild == undefined)
                throw new Error(`Bot not in guild ${guildId}`);
            route = Routes.applicationGuildCommands(appId, guild.id);
        });
    }
    return route;
}
async function getCommandByName(appId: Snowflake, command: string, guildId?: Snowflake) {
    const existingCommands = await rest.get(await getRoute(appId, guildId)) as unknown as any[];
    console.log(existingCommands);
}