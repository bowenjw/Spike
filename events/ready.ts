import { Client, ContextMenuCommandBuilder, Events, REST, RESTPostAPIApplicationCommandsJSONBody, Routes, SelectMenuBuilder, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv'
import { Command } from '../util/types';

export const name = Events.ClientReady,
once = true;

dotenv.config();

export function execute(client: Client) {
    
	console.log(`\nReady! Logged in as ${client.user!.tag}`);
	putCommands()
}

const BaseFilePath = './interactions',
    token = process.env.DISCORD_TOKEN!,
	applicationID = process.env.DISCORD_APPLICATION_ID!,
rest = new REST({ version: '10' }).setToken(token);

export async function putCommands() {
    console.log('Started refreshing application (/) commands.');

    rest.put(Routes.applicationCommands(applicationID),{body: await getCommandJSONs()})
    .then(() => console.log('Successfully reloaded application (/) commands.'))
    .catch(console.error)
}


async function getCommandJSONs() {
    const commands:RESTPostAPIApplicationCommandsJSONBody[] = [],
    commandFilesDir: string[] = [],
    commandDir = 'application_command';
    const files = fs.readdirSync(`${BaseFilePath}/${commandDir}`).filter(file => file.endsWith('.ts'))
    for (const file of files) {
        commandFilesDir.push(`../${BaseFilePath}/${commandDir}/${file.slice(0,-3)}`)
    }
    
    // console.log(commandFilesDir)
    for (const dir of commandFilesDir) {
        await import(dir).then((obj: Command) => {
            // console.log(obj)
            let builder: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | ContextMenuCommandBuilder | undefined = obj.slashCommandBuilder
            if(builder)
                commands.push(builder.toJSON())
            
            builder = obj.messageContextMenuCommand
            if(builder)
                commands.push(builder.toJSON())

            builder = obj.userContextMenuCommand
            if(builder)
                commands.push(builder.toJSON())
        })
    }
    // console.log(commands)
    return commands
}