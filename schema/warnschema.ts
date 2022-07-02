import {Document, Schema, model} from 'mongoose';

interface Iwarn extends Document {
    _id:Schema.Types.ObjectId,
    guildID:string,
    userID:string,
    officerID:string,
    reason:string,
    resovled:boolean,
    expireAt:Date,
    createdAt:Date
}
interface Itemp extends Document {
    _id:Schema.Types.ObjectId,
    guildID:string,
    userID:string,
    officerID:string,
    reason:string,
    expireAt:Date,
    createdAt:Date
}
const warn = new Schema<Iwarn>({
    guildID: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    officerID: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required:true,
        default: 'No Reason Given'
    },
    resovled: {
        type: Boolean,
        default: false,
        required: true,
    },
    expireAt: {
        type: Date,
        default: new Date().setDate(new Date().getDate()+90),
        required:true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
        required: true
    }
});

const warntemp = new Schema<Itemp>({
    guildID: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    officerID: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required:true,
        default: 'No Reason Given'
    },
    expireAt: {
        type: Date,
        default: new Date().setDate(new Date().getDate()+90),
        required:true,
    }
}, { timestamps: true});

warntemp.index({'createdAt': 1}, {expireAfterSeconds: 1800})
export const warningSchema = model<Iwarn>('warnings', warn);
export const warningTemp = model<Itemp>('tempWarnings', warntemp);