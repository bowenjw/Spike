import { Snowflake } from "discord.js"

interface Iuser {
    id: Snowflake,
    tag: String
}

export interface Iwarn  {
    guildId: Snowflake,
    target: Iuser,
    officer: Iuser,
    updater?:Iuser,
    reason: string,
    expireAt: Date,
    createdAt: Date
}