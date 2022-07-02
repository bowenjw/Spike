import { Guild } from "discord.js";
import guildsettings from "../schema/guildsettings";
import {warningSchema} from "../schema/warnschema";

import { Event } from '../types';

const event: Event = {
    name: 'guildDelete',
	once: false,
	async execute(guild: Guild) {
        guildsettings.findOne({guildID:guild.id}).deleteOne().catch((error)=>{console.log(error);});
        warningSchema.find({guildID:guild.id}).deleteMany().catch((error)=>{console.log(error);});
    }
}

export = event;