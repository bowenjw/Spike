import { Guild } from "discord.js";
import guildsettings from "../schema/guildsettings";
import warnschema from "../schema/warnschema";

module.exports = {
	name: 'guildDelete',
	once: false,
	async execute(guild: Guild) {
        guildsettings.findOne({guildID:guild.id}).deleteOne().catch((error)=>{console.log(error);});
        warnschema.find({guildID:guild.id}).deleteMany().catch((error)=>{console.log(error);});
    }
}