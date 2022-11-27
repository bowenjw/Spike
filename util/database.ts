import { Guild, TextChannel } from "discord.js";
import { guilds, ISystem } from "./schema/guilds";

enum Systems {
    TimeoutLog = 0,
    warn = 1,
}

export const config = {
    get: getConfig,
    setFeture,
}

async function getConfig(guild: Guild) {
    try {
        const record = await guilds.findOne({guild:{id:guild.id}})
        if(record)
            return record
        else 
            return guilds.create({guild:{id:guild.id, name:guild.name}})
    } catch (error) {console.log(error)}

}
async function setFeture(guild:Guild, feture: number, enable:boolean, channel: TextChannel ) {
    const config = await getConfig(guild);
    let fetureConfig:ISystem | null
    if(enable)
        fetureConfig!.enabled = enable;
    if(channel)
       fetureConfig!.channel = channel.id;
    console.log(fetureConfig!)
}