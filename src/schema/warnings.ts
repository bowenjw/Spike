import { Snowflake, User } from 'discord.js';
import { Document, Schema, model, Types, DateSchemaDefinition} from 'mongoose';
import { Iwarn } from '../interfaces';

export type warningRecord = Document<unknown, any, Iwarn> & Iwarn & {_id: Types.ObjectId;}

const userObject = {
    id: { type: String, require:true },
    tag: { type: String, require:true }
},
noReason = 'No Reason Given',
warn = new Schema<Iwarn>({
    guildId: { type: String, required: true, ref: 'guilds' },
    target: userObject,
    officer: userObject,
    updater:{ 
        id: { type: String },
        tag: { type: String },
    },
    reason: { type: String, required: true, default: noReason },
    expireAt: { type: Date, required:true }
}, {timestamps: true}),
warningModel = model<Iwarn>('warnings', warn)


export const warnings = {
    create: createWarning,
    find: findWarnings,
    findById: findWarnById,
    updateById: updateWarning,
    removeById: removeWarning,
}
async function createWarning(guildId:Snowflake, target:User, officer:User, reason:string = noReason, days?:number ) {
    
    const expireAt:Date = setDate(days)
    
    return warningModel.create({ 
        guildId:guildId, 
        target:{ id:target.id, tag:target.tag }, 
        officer:{ id:officer.id, tag:officer.tag },
        reason: reason, 
        expireAt: expireAt
    })
}

async function findWarnings(guildId:Snowflake, targetId: Snowflake, expireAt?:Date) {

    let filter: any
    
    if(expireAt)
        filter = { guildId: guildId, "target.id":targetId, expireAt: { $gte: expireAt } }
    else
        filter = { guildId: guildId, "target.id":targetId }

    return warningModel.find(filter)
}
async function findWarnById(id:string) {
    return await warningModel.findById(id)
}

async function updateWarning(id:string, updater:User, reason?:string, days?:number) {
    
    if(reason == undefined && days == undefined) return undefined
    
    const expireAt:Date = setDate(days)
    let update:any = new Object()
    
    update["updater"] = {id:updater.id, tag:updater.tag }
    if(reason) update["reason"] = reason
    if(expireAt) update["expireAt"] = expireAt
    
    return await warningModel.findByIdAndUpdate(id, update)
}

async function removeWarning(id:string) {
    return warningModel.findByIdAndRemove(id)
}

/**
 * 
 * @param days number of days to set the date
 * @returns New Date
 */
function setDate(days:number = 90) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d
}