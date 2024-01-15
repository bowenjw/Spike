import { Client } from '../ExtendedClient';

export class BaseHandler {

    readonly client:Client;

    constructor(client:Client) {
        this.client = client;
    }
}
