import mongoose from 'mongoose';

const warn = new mongoose.Schema({
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
        required:true
    }
}, { timestamps: true});

warn.index({ "expireAt": 1 }, {expireAfterSeconds: 0 } )


export default mongoose.model('warning', warn);