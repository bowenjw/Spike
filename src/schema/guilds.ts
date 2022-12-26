import { Guild } from 'discord.js';
import { Document, Schema, model, Types } from 'mongoose';
import { IGuild, ISystem, IwarnningSystem } from '../interfaces';

enum Fetures {
    Timeoutlog = "timeout",
    Warnings = "warning"
}

export type GuildRecord = (Document<unknown, any, IGuild> & IGuild & {_id: Types.ObjectId; })

const guild = new Schema<IGuild>({
    id: { type: String, require: true, unique: true},
    name: { type: String, require: true },
    warning: {
        channel: { type: String, require: false },
        enabled: { type: Boolean, require: true, default: false },
        appealMessage: { type: String, require:false },
        maxActiveWarns: {type: Number, require: true, default: 3}
    },
    timeoutlog: {
        channel: { type: String, require: false },
        enabled: { type: Boolean, require: true, default: false },
    }
}),
guildsModel = model<IGuild>('guilds', guild);

export const guilds = {
    get,
    set,
    DB: guildsModel
}

async function get(guild: Guild) {
    try {
        const record = await guildsModel.findOne({id:guild.id})
        if(record)
            return record
        else 
            return await guildsModel.create({id:guild.id, name:guild.name})
    } catch (error) {console.log(error)}
}

async function set(guild: Guild, feture:Fetures, options:ISystem | IwarnningSystem) {
    
}