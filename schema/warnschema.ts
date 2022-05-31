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
        default: new Date().setDate(new Date().getDate()+90),
        required:true,
    }
}, { timestamps: true});

export default mongoose.model('warning', warn);