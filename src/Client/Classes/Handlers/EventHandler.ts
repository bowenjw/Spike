import { Client, Collection } from 'discord.js';
import { Event } from '../Event';

export class EventHandler {
    private client: Client;

    private events: Collection<string, Event> = new Collection();

    add(event: Event) {
        if (event.once) this.client.once(event.name, event.execute);
        else this.client.on(event.name, event.execute);
        this.events.set(event.name, event);
    }

    get size() {
        return this.events.size;
    }

    constructor(client: Client) {
        this.client = client;
    }
}
