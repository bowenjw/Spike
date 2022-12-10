import { Guild, Snowflake, TextChannel } from 'discord.js';
import { Document, Schema, model, Types } from 'mongoose';
import { Fetures } from '../types';


export interface ISystem {
    channel: Snowflake,
    enabled: boolean
}
interface IGuild{
    id: Snowflake,
    name: string,
    warnSystem: ISystem
    TimeoutLog: ISystem
}

export type GuildRecord = (Document<unknown, any, IGuild> & IGuild & {_id: Types.ObjectId; })

const guild = new Schema<IGuild>({
    id: { type: String, require: true, unique: true},
    name: { type: String, require: true },
    warnSystem: {
        channel: { type: String, require: false },
        enabled: { type: Boolean, require: true, default: false },
    },
    TimeoutLog: {
        channel: { type: String, require: false },
        enabled: { type: Boolean, require: true, default: false },
    }
}),

guilds = model<IGuild>('guilds', guild);

export const guildDB = {
    get: getConfig,
    setFeture,
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
async function setFeture(record: GuildRecord, feture: number, enable:boolean | null, channel: TextChannel | null ) {
    
    switch (feture) {

        case Fetures.Timeout:
            timeout(record, enable, channel)
            break;

        case Fetures.Warn:
            warn(record, enable, channel)
            break;

        default:
            break;
    }
}

function timeout(
    record: GuildRecord,
    enable: boolean | null, 
    channel: TextChannel | null) {
        
    if(enable)
        record.TimeoutLog.enabled = enable;
    if(channel)
        record.TimeoutLog.channel = channel.id;
    record.save()
}

function warn(
    record: GuildRecord,
    enable: boolean | null,
    channel: TextChannel | null) {
        
    if(enable)
        record.warnSystem.enabled = enable;
    if(channel)
        record.warnSystem.channel = channel.id;
    record.save()
}
