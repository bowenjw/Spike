import { Snowflake } from 'discord.js';
import {Schema, model} from 'mongoose';

interface IwarningCounter {
    guildId: Snowflake,
    counter: number
}

export interface Iwarn  {
    guildId: Snowflake,
    userId: Snowflake,
    officerId: Snowflake,
    reason:string,
    expireAt:Date,
    createdAt:Date
}

const warn = new Schema<Iwarn>({
    guildId: { type: String, required: true, ref: 'guilds' },
    userId: { type: String, required: true },
    officerId: { type: String, required: true },
    reason: { type: String, required: true, default: 'No Reason Given' },
    expireAt: { type: Date, required:true }
}, {timestamps: true}),

warningCounter = new Schema<IwarningCounter>({
    guildId: {
        type: String,
        required: true,
        unique:true,
        ref: 'guilds'
    },
    counter: {
        type: Number,
        require: true,
        default: 0
    }
})

export const warnings = model<Iwarn>('warnings', warn),
warningCounters = model<IwarningCounter>('warningCounter', warningCounter)