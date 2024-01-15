import { Collection } from 'discord.js';
import { Event } from '../Event';
import { BaseHandler } from './baseHandler';

export class EventHandler extends BaseHandler {

    protected _events: Collection<string, Event> = new Collection();

    get event() {
        return this._events;
    }

    get size() {
        return this._events.size;
    }

    add(event: Event) {
        if (event.once) this.client.once(event.name, event.execute);
        else this.client.on(event.name, event.execute);
        this._events.set(event.name, event);
    }
}
