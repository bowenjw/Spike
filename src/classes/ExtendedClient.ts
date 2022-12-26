import { Client, Collection } from 'discord.js';
import { Icommand, Ievent, Iinteraction } from '../interfaces';
//import configJSON from '../config.json';
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
    public commands: Collection<string, Icommand> = new Collection();
    public contextMenus : Collection<string, Icommand> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public interactions: Collection<string, Iinteraction> = new Collection();

    readonly eventPath = path.join(__dirname, '..', 'events')
    readonly interactionPath = path.join(__dirname, '..', 'interactions')
    readonly commandPath = path.join(__dirname, '..', 'commands', 'chat')
    readonly contextMenuPath = path.join(this.commandPath, '..', 'context_menu')
    readonly RESTVersion = '10'

    public async init() {

        console.log('Starting up...')
        
        // Command Handler
        readdirSync(this.commandPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
        // console.log(path.join(this.commandPath, file))    
        import(path.join(this.commandPath, file))
            .then((command:Icommand) => {
                // console.log(command)
                this.commands.set(command.builder.name, command)
            })
        })

        // context Menus Handler
        // console.log(readdirSync(this.contextMenuPath))
        readdirSync(this.contextMenuPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => 
            import(path.join(this.contextMenuPath, file))
            .then((command:Icommand) => {
                // console.log(command.builder.name)
                this.contextMenus.set(command.builder.name, command)
            })
        )

        // Interaction Handler
        readdirSync(this.interactionPath).forEach((dir) => {
            readdirSync(path.join(this.interactionPath, dir)).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js'))
            .forEach((file) => {
                import(path.join(this.interactionPath, dir, file))
                .then((interaction:Iinteraction) => {
                    // console.log(interaction)
                    this.interactions.set(interaction.name, interaction)})
            })
        });

        // Event Handler
        readdirSync(this.eventPath).filter((dir) => dir.endsWith(tsNodeRun ? '.ts' : '.js'))
        .forEach((file) => import(path.join(this.eventPath, file))
            .then((event:Ievent) => {
                if (event.once) 
                    this.once(event.name, (...args) => event.execute(...args))
                else
                    this.on(event.name, (...args) => event.execute(...args))
            })
        )

        // Login
        if (!process.env.DISCORD_TOKEN) return console.error('No token was specified. Did you create a .env file?');
        this.login(process.env.DISCORD_TOKEN);
    }
}

export default ExtendedClient;