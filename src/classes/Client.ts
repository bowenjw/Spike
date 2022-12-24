import { Client, Collection } from 'discord.js';
import { Command, Event, Interaction } from '../interfaces';
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
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public interactions: Collection<string, Interaction> = new Collection();
    readonly commandPath = path.join(__dirname, '..', 'commands')
    readonly interactionPath = path.join(__dirname, '..', 'interactions')
    readonly eventPath = path.join(__dirname, '..', 'events')
    public async init() {

        console.log('Starting up...')
        
        // Command Handler
        readdirSync(this.commandPath).forEach((dir) => {
            readdirSync(`${this.commandPath}/${dir}`).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js'))
            .forEach((file) => 
                import(`${this.commandPath}/${dir}/${file}`)
                .then((command) => this.commands.set(command.options.name, command))
            )
        });

        // Interaction Handler
        readdirSync(this.interactionPath).forEach((dir) => {
            readdirSync(`${this.interactionPath}/${dir}`).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js'))
            .forEach((file) => 
                import(`${this.interactionPath}/${dir}/${file}`)
                .then((interaction) => this.interactions.set(interaction.name, interaction))
            )
        });

        // Event Handler
        readdirSync(`${this.eventPath}`).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js'))
        .forEach((fileName) => import(`${this.eventPath}/${fileName}`)
            .then((event) => {
                if (event.once) 
                    this.once(event.name, (...args) => event.execute(...args))
                else
                    this.on(event.name, (...args) => event.execute(...args))
            })
        )

        // Login
        if (!process.env.TOKEN) return console.error('No token was specified. Did you create a .env file?');
        this.login(process.env.TOKEN);
    }
}

export default ExtendedClient;