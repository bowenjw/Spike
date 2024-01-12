import { Guild, Snowflake } from 'discord.js';
import { Document, Model, Schema, Types, model } from 'mongoose';
import { GuildConfig } from './Guild';

// enum Feture {
//     Timeoutlog = 'timeout',
//     Warnings = 'warning'
// }

export interface ISystem {
    channelId?: Snowflake,
    enabled: boolean
}
export interface IwarnningSystem extends ISystem {
    appealMessage?: string,
    maxActiveWarns: number
}
export interface IGuild{
    guildId: Snowflake,
    name: string,
    warning: IwarnningSystem
    timeoutlog: ISystem
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GuildRecord = Document<unknown, any, IGuild> & IGuild & {_id: Types.ObjectId; };

const guildSchema = new Schema<IGuild>({
    guildId: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    warning: {
        channelId: { type: String, require: false },
        enabled: { type: Boolean, require: true, default: false },
        appealMessage: { type: String, require:false },
        maxActiveWarns: { type: Number, require: true, default: 3 },
    },
    timeoutlog: {
        channelId: { type: String, require: false },
        enabled: { type: Boolean, require: true, default: false },
    },
},
{
    statics: {
        async getGuild(guild:Guild) {
            let record = await this.findOne({ guildId: guild.id });
            if (!record) {
                record = await this.create({ id:guild.id, name:guild.name });
            }
            return new GuildConfig(guild, record) ;
        },

    },
});

interface guildDB extends Model<IGuild> {
   getGuild(guild:Guild): Promise<GuildConfig>
}

export const guildsModel = model<IGuild>('guilds', guildSchema) as guildDB;
