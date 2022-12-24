import ExtendedClient from '../classes/Client';
import { REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { ApplicationCommand, ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import { Command } from '../interfaces';
import { readdirSync } from 'fs';

export default async function deploy(client: ExtendedClient) {
    // Skip if no-deployment flag is set
    if (process.argv.includes('--no-deployment')) return;

    const rest = new REST({ version: '10' }).setToken(client.token!),
        commands: RESTPostAPIApplicationCommandsJSONBody[] = []

    console.log(`Deploying commands...`);
    
    readdirSync(client.commandPath).filter(file => file.endsWith('.ts'))
    .forEach((file) => {
        import(`${client.commandPath}/${file.slice(0,-3)}`)
        .then((command:Command) => {
            let builder: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | ContextMenuCommandBuilder | undefined = command.slashCommandBuilder;
            if(builder) commands.push(builder.toJSON());
            
            builder = command.messageContextMenuCommand;
            if(builder) commands.push(builder.toJSON());

            builder = command.userContextMenuCommand;
            if(builder) commands.push(builder.toJSON());
        })
    })

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