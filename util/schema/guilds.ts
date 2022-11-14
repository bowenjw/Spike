import { Snowflake } from 'discord.js';
import { Schema, model } from 'mongoose';

export interface ISystem {
    channel: Snowflake,
    enabled: boolean
}
export interface IGuild{
    guildId: Snowflake,
    warnSystem: ISystem
    TimeoutLog: ISystem
}

const guild = new Schema<IGuild>({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    warnSystem: {
        channel: {
            type: String,
            required: false,
        },
        enabled: {
            type: Boolean,
            require: true,
            default: false,
        },
        
    },
    TimeoutLog: {
        channel: {
            type: String,
            required: false,
        },
        enabled: {
            type: Boolean,
            require: true,
            default: false,
        },
    }
});

export const guilds = model<IGuild>('guilds', guild);
