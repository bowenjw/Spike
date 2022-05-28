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
    }
}, { timestamps: true});

warn.index({createdAt: 1},{expireAfterSeconds: 7890000});


export default mongoose.model('warning', warn);