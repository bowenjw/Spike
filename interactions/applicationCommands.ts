
import { REST, Routes, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv'
import { CommandInteractionObj } from '../types'

dotenv.config();
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
        commandFilesDir.push(`./${commandDir}/${file.slice(0,-3)}`)
    }
    // console.log(commandFilesDir)
    for (const dir of commandFilesDir) {
        await import(dir).then((obj: CommandInteractionObj) => {
            // console.log(obj)
            commands.push(obj.builder.toJSON())
        })
    }
    // console.log(commands)
    return commands
}