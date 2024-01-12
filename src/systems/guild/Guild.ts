import { Guild as DiscordGuild, TextChannel, ThreadChannel } from 'discord.js';
import { GuildRecord } from './guild-schema';

export class WarningConfig {

    private dbAnchor:GuildRecord;

    protected _channel: TextChannel | ThreadChannel;

    get enabled() {
        return this.dbAnchor.warning.enabled;
    }

    private set enabled(state:boolean) {
        this.dbAnchor.warning.enabled = state;
    }

    get maxWarns() {
        return this.dbAnchor.warning.maxActiveWarns;
    }

    private set maxWarns(max:number) {
        this.dbAnchor.warning.maxActiveWarns = max;
    }

    get appealMessage() {
        return this.dbAnchor.warning.appealMessage;
    }

    private set appealMessage(message:string | undefined) {
        this.dbAnchor.warning.appealMessage = message;
    }

    get channel() {
        return this._channel;
    }

    enabledSystem() {
        return this.setSystemStatus(true);
    }
    disableSystem() {
        return this.setSystemStatus(false);
    }

    async setSystemStatus(state:boolean) {
        this.enabled = state;
        return this;
    }

    setMaxWarns(max:number = 3) {
        this.maxWarns = max;
        return this;
    }

    setChannel(channel:TextChannel | ThreadChannel) {
        this._channel = channel;
        this.dbAnchor.warning.channelId = channel.id;
        return this;
    }


    async setAppealMessage(message?:string) {
        this.appealMessage = message;
        return this;
    }

    save() {
        return this.dbAnchor.save();
    }

    constructor(config:GuildConfig, guildDoc:GuildRecord) {
        const feture = guildDoc.warning;
        this.dbAnchor = guildDoc;
        this.enabled = feture.enabled;
        this._channel = config.guild.channels.cache.get(feture.channelId) as TextChannel | ThreadChannel;
    }
}

class TimeoutConfig {

    private dbAnchor:GuildRecord;

    protected _channel: TextChannel | ThreadChannel;

    get enabled() {
        return this.dbAnchor.timeoutlog.enabled;
    }

    private set enabled(state:boolean) {
        this.dbAnchor.timeoutlog.enabled = state;
    }

    get channel() {
        return this._channel;
    }

    enabledSystem() {
        return this.setSystemStatus(true);
    }

    disableSystem() {
        return this.setSystemStatus(false);
    }

    async setSystemStatus(state:boolean) {
        this.enabled = state;
        return this;
    }

    save() {
        return this.dbAnchor.save();
    }

    constructor(config:GuildConfig, guildDoc:GuildRecord) {
        const feture = guildDoc.timeoutlog;
        this.dbAnchor = guildDoc;
        this.enabled = feture.enabled;
        this._channel = config.guild.channels.cache.get(feture.channelId) as TextChannel | ThreadChannel;
    }
}

export class GuildConfig {

    // Connects object to the DB
    private readonly dbAnchor: GuildRecord;

    readonly guild: DiscordGuild;

    readonly warning: WarningConfig;

    readonly timeout: TimeoutConfig;

    get id() {
        return this.dbAnchor._id;
    }

    save() {
        return this.dbAnchor.save();
    }

    constructor(guild:DiscordGuild, guildDoc:GuildRecord) {
        this.dbAnchor = guildDoc;
        this.guild = guild;
        this.warning = new WarningConfig(this, this.dbAnchor);
        this.timeout = new TimeoutConfig(this, guildDoc);
    }
}
