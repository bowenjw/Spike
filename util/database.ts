import { Snowflake } from "discord.js";
import { guilds } from "./schema/guilds";

export const config = {
    get: getConfig
}

async function getConfig(guildId: Snowflake) {
    try {
        const record = await guilds.findOne({guildId: guildId})
        if(record)
            return record
        else 
            return await guilds.create({guildId: guildId})
    } catch (error) {console.log(error)}

}