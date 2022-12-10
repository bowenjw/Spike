import { Snowflake } from 'discord.js';
import {Schema, model} from 'mongoose';

interface Iuser {
    id: Snowflake,
    tag: String
}

export interface Iwarn  {
    guildId: Snowflake,
    target: Iuser,
    officer: Iuser,
    reason: string,
    expireAt: Date,
    createdAt: Date
}

const warn = new Schema<Iwarn>({
    guildId: { type: String, required: true, ref: 'guilds' },
    target: { 
        id:{ type: String, require:true },
        tag: { type: String, require:true }
    },
    officer: { 
        id:{ type: String, require:true },
        tag: { type: String, require:true }
    },
    reason: { type: String, required: true, default: 'No Reason Given' },
    expireAt: { type: Date, required:true }
}, {timestamps: true})

export const warnings = model<Iwarn>('warnings', warn)