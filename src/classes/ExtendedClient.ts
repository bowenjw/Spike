import { ApplicationCommand, Client, ClientOptions, Collection, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { Icommand, Ievent, Iinteraction } from '../interfaces';
// import configJSON from '../config.json';
import path from 'path';
import { readdirSync } from 'fs';

// TypeScript or JavaScript environment (thanks to https://github.com/stijnvdkolk)
let tsNodeRun = false;
try {
    // @ts-ignore
    if (process[Symbol.for('ts-node.register.instance')]) {
        tsNodeRun = true;
    }
} catch (e) { }

class ExtendedClient extends Client {
    readonly commands: Collection<string, Icommand> = new Collection();
    readonly contextMenus : Collection<string, Icommand> = new Collection();
    readonly events: Collection<string, Ievent> = new Collection();
    readonly buttons: Collection<string, Iinteraction> = new Collection();
    readonly selectMenus: Collection<string, Iinteraction> = new Collection();
    readonly modals: Collection<string, Iinteraction> = new Collection();


    readonly eventPath = path.join(__dirname, '..', 'events')
    readonly commandPath = path.join(__dirname, '..', 'commands', 'chat')
    readonly contextMenuPath = path.join(__dirname, '..', 'commands', 'context_menu')
    readonly buttonPath = path.join(__dirname, '..', 'interactions', 'button')
    readonly selectMenuPath = path.join(__dirname, '..', 'interactions', 'select_menu')
    readonly modalPath = path.join(__dirname, '..', 'interactions', 'modal')
    
    constructor(options: ClientOptions) {
        super(options)
        console.log('Starting up...')
        const commands: RESTPostAPIApplicationCommandsJSONBody[] = []

        // Command Handler
        readdirSync(this.commandPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
            import(path.join(this.commandPath, file)).then((command:Icommand) => {
                commands.push(command.builder.toJSON())
                this.commands.set(command.builder.name, command)
            });
        });

        // context Menus Handler
        readdirSync(this.contextMenuPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
            import(path.join(this.contextMenuPath, file)).then((command:Icommand) => {
                this.contextMenus.set(command.builder.name, command)
                commands.push(command.builder.toJSON()) 
            });
        });

        // Button Handler
        readdirSync(this.buttonPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
            import(path.join(this.buttonPath, file)).then((interaction:Iinteraction) => {
                this.buttons.set(interaction.name, interaction) 
            });
        });

        // Select Menu Handler
        readdirSync(this.buttonPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
            import(path.join(this.buttonPath, file)).then((interaction:Iinteraction) => {
                this.selectMenus.set(interaction.name, interaction) 
            });
        });

        // Modal Handler
        readdirSync(this.modalPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
            import(path.join(this.modalPath, file)).then((interaction:Iinteraction) => {
                this.modals.set(interaction.name, interaction) 
            });
        });


        // Event Handler
        readdirSync(this.eventPath).filter((dir) => dir.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => import(path.join(this.eventPath, file))
            .then((event:Ievent) => {

                this.events.set(event.name, event);

                if (event.once) 
                    this.once(event.name, (...args) => event.execute(...args))
                else
                    this.on(event.name, (...args) => event.execute(...args))
            })
        )

        // Login
        if (!process.env.DISCORD_TOKEN) console.error('No token was specified. Did you create a .env file?');
        this.login(process.env.DISCORD_TOKEN);
        
        // Deploying Commands
        async () => {
            // Skip if no-deployment flag is set
            if (process.argv.includes('--no-deployment')) return;
            
            const rest = new REST({ version: '10' }).setToken(this.token!)
            const applicationCommands = await rest.put(Routes.applicationCommands(this.user!.id), { body: commands })
                .catch(console.error) as ApplicationCommand[];
        
            console.log(`Deployed ${applicationCommands.length} global commands`);
        }
        
    }
}

export default ExtendedClient;