import ExtendedClient from '../classes/ExtendedClient';
import { REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { ApplicationCommand } from 'discord.js';
import { Icommand } from '../interfaces';
import { readdirSync } from 'fs';
import path from 'path';

export async function deploy(client: ExtendedClient) {
    // Skip if no-deployment flag is set
    if (process.argv.includes('--no-deployment')) return;

    const rest = new REST({ version: client.RESTVersion }).setToken(client.token!),
        commands: RESTPostAPIApplicationCommandsJSONBody[] = []

    console.log(`Deploying commands...`);
    // console.log(readdirSync(client.commandPath))
    for (const file of readdirSync(client.commandPath)) {
        await import( path.join(client.commandPath, file) )
        .then((command:Icommand) => { 
            // console.log(command)
            commands.push(command.builder.toJSON()) 
        })
    }
    
    // Deploy global commands
    const applicationCommands = await rest.put(Routes.applicationCommands(client.user!.id), { body: commands })
        .catch(console.error) as ApplicationCommand[];

    console.log(`Deployed ${applicationCommands.length} global commands`);

    // Deploy guild commands
    // if (!client.config.interactions.useGuildCommands) return;
    // if (client.config.guild === "your_guild_id") return console.log('Please specify a guild id in order to use guild commands')
    // const guildId = client.config.guild;
    // const guild = await client.guilds.fetch(guildId).catch(console.error);
    // if (!guild) return;

    // const applicationGuildCommands = await rest.put(Routes.applicationGuildCommands(client.user!.id, guildId), { body: guildDeploy })
    //     .catch(console.error) as ApplicationCommand[];

    // console.log(`Deployed ${applicationGuildCommands?.length || 0} guild commands to ${guild.name}`);

}