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
        id: { Type: String, required: true, unique: true},
        name: { Type: String, required: true }
    },
    warnSystem: {
        channel: { type: String, required: false },
        enabled: { type: Boolean, require: true, default: false },
        
    },
    TimeoutLog: {
        channel: { type: String, required: false },
        enabled: { type: Boolean, require: true, default: false },
    }
});

export const guilds = model<IGuild>('guilds', guild);
