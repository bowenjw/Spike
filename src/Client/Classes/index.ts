export { ChatInputCommand, Command, ContextMenuCommand } from './Command';

export { Event } from './Event';

export { Interaction } from './Interaction';

export { Client } from './ExtendedClient';


import { Client as EClient } from './ExtendedClient';
declare module 'discord.js' {
	interface BaseInteraction {
		client: EClient;
	}
	interface Component {
		client: EClient;
	}
	interface Message {
		client: EClient;
	}
	interface BaseChannel {
		client: EClient;
	}
	interface Role {
		client: EClient;
	}
	interface Guild {
		client: EClient;
	}
	interface User {
		client: EClient;
	}
	interface GuildMember {
		client: EClient;
	}
}
