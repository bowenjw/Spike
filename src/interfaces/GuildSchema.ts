import { Snowflake } from 'discord.js';

export interface ISystem {
    channel?: Snowflake,
    enabled: boolean
}
export interface IwarnningSystem extends ISystem {
    appealMessage?: string,
    maxActiveWarns: number
}
export interface IGuild{
    id: Snowflake,
    name: string,
    warning: IwarnningSystem
    timeoutlog: ISystem
}