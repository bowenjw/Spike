import { REST } from '@discordjs/rest';
import { GuildResolvable, RESTPatchAPIApplicationCommandJSONBody, RESTPostAPIApplicationCommandsJSONBody, Routes, Snowflake } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import { Command } from '../types'
import { client } from '../client';

dotenv.config();

const token = process.env.DISCORD_TOKEN!,
appId = process.env.APPLICATIONID!,
// guildId = process.env.GUILDID!,
rest = new REST({ version: '10' }).setToken(token);

async function registerGuildCommands(guildResolvable: GuildResolvable) {
    const fsFilePath = './interactions/commands',
    guild = await client.guilds.fetch({cache: true, force: false, guild: guildResolvable, withCounts: false});
    
    deleteCommands(appId, guild.id)
    putCommands(appId, getcommandJSONs(fsFilePath), guild.id);

}

export async function registerGlobalCommands() {
    const fsFilePath = './interactions/commands';
    deleteCommands(appId);
    putCommands(appId, getcommandJSONs(fsFilePath));

}

function getcommandJSONs(fsFilePath: string) {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const files = fs.readdirSync(fsFilePath).filter(file => file.endsWith('.ts'))
    // console.log(files); // loges command files read
    for (const file of files) {
        const path = `../${fsFilePath}/${file}`;
        // console.log(path) // looges command path
        const command: Command = require(path);
        // console.log(command) // loges commad
        // console.log(command.name);
        commands.push(command.commandBuilder.toJSON());
    }
    return commands;
}
/**
 * Removes gobal or guild commands
 * @param appId Application ID
 * @param guildId guild ID if needed
 */
async function deleteCommands(appId: Snowflake, guildId?: Snowflake) {
    
    const existingCommands = await rest.get(await getRoute(appId, guildId)) as unknown
    // console.log(existingCommands);
    let deleteUrl: string;
    for (const command of existingCommands as any[]) {
        if(guildId)
            deleteUrl = Routes.applicationGuildCommand(appId, guildId, command.id)
        else
            deleteUrl = Routes.applicationCommand(appId,command.id);
        rest.delete(`/${deleteUrl}`);
    }
}
/**
 * 
 * @param appId Application ID
 * @param commands command that will be
 * @param guildId guild id if guild command
 */
async function putCommands(appId: Snowflake, commands:RESTPostAPIApplicationCommandsJSONBody[], guildId?: Snowflake) {
    
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
 * param appId Application ID
 * param command command that will be
 * param guildId guild id if guild command
export async function patchCommand(appId:Snowflake, command:RESTPatchAPIApplicationCommandJSONBody, guildId?: Snowflake) {

    const route = await getRoute(appId, guildId);

    try {
		console.log('Started patching application (/) commands.');

		await rest.patch(route, { body: command });

		console.log('Successfully patching application (/) commands.');
	} catch (error) {
		console.error(error);
	}

}
 */

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
async function getCommandByName(appId:Snowflake, command:string, guildId?: Snowflake) {
    const route = await getRoute(appId, guildId);

}