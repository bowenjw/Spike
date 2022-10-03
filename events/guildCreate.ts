import { Guild } from "discord.js";
import guildsettings from "../schema/guildsettings"

import { Event } from '../types';

const event: Event = {
    name: 'guildCreate',
	once: false,
	async execute(guild: Guild) {

        /* const newguild = new guildsettings({
            guildID:guild.id,
            ping:{
                enabled:true,
            },
            eightball:{
                enabled:true,
            },
            warnning:{
                enabled:false,
            }
        });
        newguild.save();*/
        console.log(`joined server ${guild.name}`)
    }
}

export = event;