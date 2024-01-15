/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, Guild, GuildMember, Snowflake } from 'discord.js';
import { Document, FilterQuery, FlatRecord, Model, Schema, Types, model } from 'mongoose';
import { Warn } from './Warn';

interface Iwarn {
    guildId: Snowflake,
    targetId: Snowflake,
    officerId: Snowflake,
    updaterId?: Snowflake,
    reason: string,
    expireAt: Date,
    createdAt: Date,
    updatedAt: Date,
}

export type WarningRecord = Document<unknown, any, Iwarn> & Iwarn & {_id: Types.ObjectId;}

const noReason = 'No Reason Given';
const warn = new Schema<Iwarn>(
    {
        guildId: { type: String, required: true, ref: 'guilds' },
        targetId: { type: String, required: true },
        officerId: { type: String, required: true },
        updaterId: { type: String, required: false },
        reason: { type: String, required: true, default: noReason },
        expireAt: { type: Date, required: true, setDate },
        updatedAt: { type: Date, required: true },
    },
    {
        timestamps: true,
        statics: {
            async createWarning(target:GuildMember, officer:GuildMember, reason?: string, days?: number) {
                const record = await this.create({
                    guildId: target.guild.id,
                    targetId: target.id,
                    officerId: officer.id,
                    reason: reason,
                    expireAt: setDate(days),
                });
                return new Warn(target.client, record);
            },
            async getWarnById(client:Client, id:string) {
                const record = await this.findById(id);
                if (!record) return undefined;
                return new Warn(client, record);
            },
            async getWarns(member:GuildMember, expireAfter?:Date) {
                const { guild, id, client } = member;
                const filter: FilterQuery<FlatRecord<Iwarn>> = { guildId: guild.id, targetId: id };

                if (expireAfter) {filter.expireAt = { $gte: expireAfter }; }

                const records = await this.find(filter);
                return records.map((record) => new Warn(client, record));
            },
            async getWarnsInGuild(guild:Guild, expireAfter?:Date) {
                const { id, client } = guild;
                const filter: FilterQuery<FlatRecord<Iwarn>> = { guildId: id };

                if (expireAfter) {filter.expireAt = { $gte: expireAfter }; }

                const records = await this.find(filter);
                return records.map((record) => new Warn(client, record));
            },
            async getWarnsOfOfficer(officer:GuildMember, expireAfter?:Date) {
                const { guild, id, client } = officer;
                const filter: FilterQuery<FlatRecord<Iwarn>> = { guildId: guild.id, officerId: id };

                if (expireAfter) {filter.expireAt = { $gte: expireAfter }; }

                const records = await this.find(filter);
                return records.map((record) => new Warn(client, record));
            },
        },
    });

interface warningModal extends Model<Iwarn> {
    createWarning(target:GuildMember, officer:GuildMember, reason?: string, days?: number): Promise<Warn>
    getWarnById(client:Client, id:string): Promise<Warn>
    getWarnsOfMember(member:GuildMember, expireAfter?:Date): Promise<Warn[]>
    getWarnsInGuild(guild:Guild, expireAfter?:Date): Promise<Warn[]>
    getWarnsOfOfficer(officer:GuildMember, expireAfter?:Date): Promise<Warn[]>
}

export const warningDb = model<Iwarn>('warnings', warn) as warningModal;

/**
 *
 * @param days number of days to set the date
 * @returns New Date
 */
function setDate(days:number = 90) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
}
