import mongoose from 'mongoose';

const feture = new mongoose.Schema({
    enabled:{
        type:Boolean,
        default:false,
        required:true,
    },
    logChannel:{
        type:String,
        required:false,
    }
});

const guild = new mongoose.Schema({
    guildID:{
        type:String,
        required:true,
        unique:true,
    },
    ping:feture,
    eightball:feture,
    warnning:feture,
});

export default mongoose.model('guildSettings', guild);
