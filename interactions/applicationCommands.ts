import { REST } from '@discordjs/rest';
import { BaseInteraction, RESTPostAPIApplicationCommandsJSONBody, Routes, Snowflake } from 'discord.js';
import fs from 'fs';
import { Command, ContextMenu, Interaction } from '../types'
import { client, token, applicationID } from '../index';


const BaseFilePath = './interactions',
// guildId = process.env.GUILDID!,
rest = new REST({ version: '10' }).setToken(token);

export async function putGlobalCommands() {
    const newCommands = await getcommandJSONs();
    putCommands(newCommands);
}

async function getcommandJSONs() {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [],
    chatCommands = fs.readdirSync(`${BaseFilePath}/commands`).filter(file => file.endsWith('.ts')),
    // userContextMenus = fs.readdirSync(`${BaseFilePath}/usercontextmenu`).filter(file => file.endsWith('.ts')),
    messageContextMenus = fs.readdirSync(`${BaseFilePath}/messagecontextmenu`).filter(file => file.endsWith('.ts'));


    // console.log(files); // loges command files read
    for (const file of chatCommands) {
        const command: Command = await require(`../${BaseFilePath}/commands/${file}`);
        commands.push(command.commandBuilder.toJSON());
    }
    /*for (const file of userContextMenus) {
        const command: ContextMenu = await require(`../${BaseFilePath}/usercontextmenu/${file}`);
        commands.push(command.contextMenuBuilder.toJSON());
    }*/
    for (const file of messageContextMenus) {
        const command: ContextMenu = await require(`../${BaseFilePath}/messagecontextmenu/${file}`);
        commands.push(command.contextMenuBuilder.toJSON());
    }
    return commands;
}
/**
 * 
 * @param commands command that will be
 * @param guildId guild id if guild command
 */
async function putCommands(commands:RESTPostAPIApplicationCommandsJSONBody[], guildId?: Snowflake) {
    
    const route = await getRoute(applicationID, guildId);
    
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
export async function runApplicationCommand(interaction: BaseInteraction) {
    let command:Interaction
    if (interaction.isChatInputCommand()) {
        command = await require(`../${BaseFilePath}/commands/${interaction.commandName}`);
    }
    else if(interaction.isUserContextMenuCommand()) {
        command = await require(`../${BaseFilePath}/usercontextmenu/${interaction.commandName}`);
    }
    else if(interaction.isMessageContextMenuCommand()) {
        command = await require(`../${BaseFilePath}/messagecontextmenu/${interaction.commandName}`);
    }
    else if(interaction.isButton()) {
        command = await require(`../${BaseFilePath}/buttons/${interaction.customId.split(' ')[0]}`);
    }
    else if(interaction.isModalSubmit()) {
        command = await require(`../${BaseFilePath}/modal/${interaction.customId.split(' ')[0]}`);
    }
    command!.execute(interaction);
}