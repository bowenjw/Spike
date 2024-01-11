import { Client } from 'discord.js';
import { GuildRecord } from './guild-schema';

export class Guild {

    // Connects object to the DB
    private readonly dbAnchor: GuildRecord;

    private readonly guild: Guild;

    // When the warn was created
    get createdAt() {
        return this.dbAnchor.createdAt;
    }

    // When the warn was updated
    get updatedAt() {
        return this.dbAnchor.updatedAt;
    }

    get id() {
        return this.dbAnchor._id;
    }

    constructor(client: Client, guildDoc:GuildRecord) {
        this.guild = client.guilds.cache.get(guildDoc);
    }
}
