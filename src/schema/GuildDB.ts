import { Guild, Snowflake } from 'discord.js';
import { Document, Schema, model, Types } from 'mongoose';






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
})

const guilds = model<IGuild>('guilds', guild);

export const guildDB = {
    get: getConfig,
    DB: guilds
}

async function getConfig(guild: Guild) {
    try {
        const record = await guilds.findOne({id:guild.id})
        if(record)
            return record
        else 
            return guilds.create({id:guild.id, name:guild.name})
    } catch (error) {console.log(error)}

}