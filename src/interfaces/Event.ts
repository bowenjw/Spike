import { ClientEvents } from 'discord.js';
import ExtendedClient from '../classes/ExtendedClient';

export interface Event {
    name: keyof ClientEvents;
    once?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(client:ExtendedClient, ...args: any[]): void;
}
