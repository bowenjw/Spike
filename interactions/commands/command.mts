import { REST } from '@discordjs/rest';
import { GuildResolvable, RESTPatchAPIApplicationCommandJSONBody, RESTPostAPIApplicationCommandsJSONBody, Routes, Snowflake } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import { Command } from '../../types'
import { client } from '../../client';

dotenv.config();

const token = process.env.DISCORD_TOKEN!,
appId = process.env.APPLICATIONID!,
// guildId = process.env.GUILDID!,
rest = new REST({ version: '10' }).setToken(token);

async function registerGuildCommands(guildResolvable: GuildResolvable) {
    const fsFilePath = './interactions/commands/guild',
    guild = await client.guilds.fetch({cache: true, force: false, guild: guildResolvable, withCounts: false});
    
    deleteCommands(appId, guild.id)
    putCommands(appId, getcommandJSONs(fsFilePath), guild.id);

}

async function registerGlobalCommands() {
    const fsFilePath = './interactions/commands/gobal';
    deleteCommands(appId);
    
    putCommands(appId, getcommandJSONs(fsFilePath));

}

function getcommandJSONs(fsFilePath: string) {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    for (const file of fs.readdirSync(fsFilePath).filter(file => file.endsWith('.ts'))) {
        const command: Command = require(`../.${fsFilePath}/${file}`);
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
    
    let existingCommands: unknown;

    if(guildId){
        await client.guilds.fetch({cache: true, force: false, guild: guildId, withCounts: false}).then(async function(guild) {
            if(guild == undefined)
                throw new Error(`Bot not in guild ${guildId}`);
            existingCommands = await rest.get(Routes.applicationGuildCommands(appId, guild.id));
        });
    } else {
        existingCommands = await rest.get(Routes.applicationCommands(appId));
    }
    
    let deleteUrl: string;
    for (const command of existingCommands as any[]) {
        if(guildId)
            deleteUrl = Routes.applicationGuildCommand(appId, guildId, command.id)
        else
            deleteUrl = Routes.applicationCommand(appId,command.id);
        rest.delete(`/${deleteUrl}`);
    }
}
async function putCommands(appId: Snowflake, commands:RESTPostAPIApplicationCommandsJSONBody[], guildId?: Snowflake) {
    let route = Routes.applicationCommands(appId);
    if(guildId){
        await client.guilds.fetch({cache: true, force: false, guild: guildId, withCounts: false}).then(async function(guild) {
            if(guild == undefined)
                throw new Error(`Bot not in guild ${guildId}`);
            route = Routes.applicationGuildCommands(appId, guild.id);
        });
    }
    
    try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(route, { body: commands });

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
}
/**
 * 
 * @param appId Application ID
 * @param command command that will be
 * @param guildId guild id if guild command
 */
export async function patchCommand(appId:Snowflake, command:RESTPatchAPIApplicationCommandJSONBody, guildId?: Snowflake) {

    let route = Routes.applicationCommands(appId);
    if(guildId){
        await client.guilds.fetch({cache: true, force: false, guild: guildId, withCounts: false}).then(async function(guild) {
            if(guild == undefined)
                throw new Error(`Bot not in guild ${guildId}`);
            route = Routes.applicationGuildCommands(appId, guild.id);
        });
    }

    try {
		console.log('Started refreshing application (/) commands.');

		await rest.patch(route, { body: command });

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}

}