import { Guild, Snowflake } from 'discord.js';
import { Document, Schema, Types, model } from 'mongoose';

// enum Feture {
//     Timeoutlog = 'timeout',
//     Warnings = 'warning'
// }

export interface ISystem {
    channel?: Snowflake,
    enabled: boolean
}
export interface IwarnningSystem extends ISystem {
    appealMessage?: string,
    maxActiveWarns: number
}
export interface IGuild{
    id: Snowflake,
    name: string,
    warning: IwarnningSystem
    timeoutlog: ISystem
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GuildRecord = Document<unknown, any, IGuild> & IGuild & {_id: Types.ObjectId; };

const guildSchema = new Schema<IGuild>({
    id: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    warning: {
        channel: { type: String, require: false },
        enabled: { type: Boolean, require: true, default: false },
        appealMessage: { type: String, require:false },
        maxActiveWarns: { type: Number, require: true, default: 3 },
    },
    timeoutlog: {
        channel: { type: String, require: false },
        enabled: { type: Boolean, require: true, default: false },
    },
}),
    guildsModel = model<IGuild>('guilds', guildSchema);

export const guilds = {
    get,
    // set,
    DB: guildsModel,
};

async function get(guild:Guild) {
    try {
        const record = await guildsModel.findOne({ id:guild.id });
        if (record) { return record; }
        else { return await guildsModel.create({ id:guild.id, name:guild.name }); }
    }
    catch (error) { console.log(error); }
}

// async function set(guild:Guild, feture:Fetures, options:ISystem | IwarnningSystem) {

// }
