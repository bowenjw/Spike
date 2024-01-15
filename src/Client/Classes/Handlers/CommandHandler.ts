import { AutocompleteInteraction, ChatInputCommandInteraction, Collection, ContextMenuCommandInteraction, REST } from 'discord.js';
import { ChatInputCommand, ContextMenuCommand } from '../Command';
import { Client } from '../ExtendedClient';
import { BaseHandler } from './baseHandler';

export class CommandHandler extends BaseHandler {

    protected readonly rest: REST;

    protected _chatCommands: Collection<string, ChatInputCommand> = new Collection();

    protected _contextCommands: Collection<string, ContextMenuCommand> = new Collection();

    get contextCommands() {
        return this._contextCommands;
    }

    get chatCommands() {
        return this._chatCommands;
    }

    add(command: ChatInputCommand | ContextMenuCommand) {
        command instanceof ChatInputCommand ? this.chatCommands.set(command.builder.name, command) : this._contextCommands.set(command.builder.name, command);
        return this;
    }

    addChatCommands(commands: Collection<string, ChatInputCommand>) {
        this._chatCommands = this._chatCommands.concat(commands);
        return this;
    }

    addContextCommands(commands: Collection<string, ContextMenuCommand>) {
        this._contextCommands = this._contextCommands.concat(commands);
        return this;
    }


    /**
	 * Deploy Application Commands to Discord
	 * @see https://discord.com/developers/docs/interactions/application-commands
	 */
    async register() {
        if (!this.client.logedIn) throw Error('Client can not register commands before init');

        console.log('Deploying commands...');

        const commandData = this.chatCommands.filter((f) => f.isGlobal === true).map((m) => m.toJSON())
            .concat(this.contextCommands.filter((f) => f.isGlobal === true).map((m) => m.toJSON()));

        const sentCommands = await this.client.application.commands.set(commandData);

        console.log(`Deployed ${sentCommands.size} global command(s)`);

        return sentCommands;
    }

    runChatCommand(interaction: ChatInputCommandInteraction) {
        return this.chatCommands.get(interaction.commandName).execute(interaction);
    }

    runAutocomplete(interaction: AutocompleteInteraction) {
        return this.chatCommands.get(interaction.commandName).autocomplete(interaction);
    }

    runContextCommand(interaction: ContextMenuCommandInteraction) {
        return this.contextCommands.get(interaction.commandName).execute(interaction);
    }

    constructor(client: Client) {
        super(client);
        this.rest = client.rest;
    }
}
