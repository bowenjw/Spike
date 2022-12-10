import { Snowflake } from 'discord.js';
import { Schema, model } from 'mongoose';

export interface ISystem {
    channel: Snowflake,
    enabled: boolean
}
export interface IGuild{
    guild: {
        id: Snowflake,
        name: string
    },
    warnSystem: ISystem
    TimeoutLog: ISystem
}

const guild = new Schema<IGuild>({
    guild: {
        id: { type: String, require: true, unique: true},
        name: { type: String, require: true }
    },
    warnSystem: {
        channel: { type: String, require: false },
        enabled: { type: Boolean, require: true, default: false },
    },
    TimeoutLog: {
        channel: { type: String, require: false },
        enabled: { type: Boolean, require: true, default: false },
    }
});

export const guilds = model<IGuild>('guilds', guild);
