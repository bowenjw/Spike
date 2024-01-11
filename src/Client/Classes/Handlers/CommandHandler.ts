import {
	AutocompleteInteraction, ChatInputCommandInteraction, Collection, ContextMenuCommandInteraction, REST
} from 'discord.js';
import { logger } from '../..';
import { ChatInputCommand, ContextMenuCommand } from '../Commands/Command';
import { ExtendedClient } from '../ExtendedClient';

export class CommandHandler {
	protected readonly client: ExtendedClient;

	protected readonly rest: REST;

	readonly chatCommands: Collection<string, ChatInputCommand> = new Collection();

	readonly contextCommands: Collection<string, ContextMenuCommand> = new Collection();

	add(command: ChatInputCommand | ContextMenuCommand) {
		command instanceof ChatInputCommand ? this.chatCommands.set(command.builder.name, command) : this.contextCommands.set(command.builder.name, command);
		return this;
	}

	addChatCommands(commands: Collection<string, ChatInputCommand>) {
		this.chatCommands.concat(commands);
		return this;
	}

	addContextCommands(commands: Collection<string, ContextMenuCommand>) {
		this.contextCommands.concat(commands);
		return this;
	}


	/**
	 * Deploy Application Commands to Discord
	 * @see https://discord.com/developers/docs/interactions/application-commands
	 */
	async register() {
		if(!this.client.logedIn) throw Error('Client can not register commands before init');

		logger.info('Deploying commands...');

		const commandData = this.contextCommands.filter((f) => f.isGlobal !== false).map((m) => m.toCommandJSON())
			.concat(this.contextCommands.filter((f) => f.isGlobal !== false).map((m) => m.toCommandJSON()));
		
		const sentCommands = await this.client.application.commands.set(commandData);
		
		logger.info(`Deployed ${sentCommands.size} global command(s)`);

		return sentCommands;
	}

	runChatCommand(interaction: ChatInputCommandInteraction){
		return this.chatCommands.get(interaction.commandName).execute(interaction);
	}

	runAutocomplete(interaction: AutocompleteInteraction){
		return this.chatCommands.get(interaction.commandName).autocomplete(interaction);
	}

	runContextCommand(interaction: ContextMenuCommandInteraction){
		return this.contextCommands.get(interaction.commandName).execute(interaction);
	}

	constructor(client: ExtendedClient) {
		this.client = client;
		this.rest = client.rest;
	}
}
