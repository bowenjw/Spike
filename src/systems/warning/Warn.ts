import { APIInteractionGuildMember, Client, ColorResolvable, EmbedBuilder, Guild, GuildMember } from 'discord.js';
import { TimeStyles } from '../../Client';
import { WarmEmbedColor } from './types';
import { WarningRecord } from './warn-schema';


export class Warn {

    // Connects object to the DB
    private dbAnchor: WarningRecord;

    // Member who was warned
    readonly member: GuildMember;

    // The member that issued the warning
    readonly officer: GuildMember;

    // The last member to update the warning
    private _updater: GuildMember;

    get updater() {
        return this._updater;
    }

    // The guild the warning came from
    readonly guild: Guild;

    // USer object for the member
    get user() {
        return this.member.user;
    }

    // The reason for the warn
    get reason() {
        return this.dbAnchor.reason;
    }

    private set reason(reason: string) {
        this.dbAnchor.reason = reason;
    }

    // When the warn exspires
    get expireAt() {
        return this.dbAnchor.expireAt;
    }

    private set expireAt(newDate: Date) {
        this.dbAnchor.expireAt = newDate;
    }

    // When the warn was created
    get createdAt() {
        return this.dbAnchor.createdAt;
    }

    // When the warn was updated
    get updatedAt() {
        return this.dbAnchor.updatedAt;
    }

    get id() {
        return this.dbAnchor._id;
    }

    private set updater(member: GuildMember) {
        if (this.guild !== member.guild) throw Error('Member not in guild of warning');
        this.dbAnchor.updaterId = member.id;
        this._updater = member;
    }

    get client() {
        return this.member.client;
    }

    /**
     * delets the warn from the database
     */
    delete() {
        return this.dbAnchor.deleteOne();
    }

    /**
     * Updates the warning with a new reason
     * @param reason The new reason to set the warning
     * @param member The member who updated the reason
     */
    setReason(reason: string, member: GuildMember) {
        this.updater = member;
        this.reason = reason;
        return this;
    }

    setNewEndDate(newDate:Date, updater: GuildMember | APIInteractionGuildMember) {
        this.updater = updater instanceof GuildMember ? updater : this.guild.members.cache.get(updater.user.id);
        this.expireAt = newDate;
        return this;
    }

    setLatestUpdater(member: GuildMember) {
        this.updater = member;
        return this;
    }

    async save() {
        this.dbAnchor = await this.dbAnchor.save();
        return this;
    }

    toEmbed(timeUpdated:boolean = false, embedColor: ColorResolvable = WarmEmbedColor.Issued) {
        return new EmbedBuilder()
            .setTitle('Warn')
            .setDescription(`**Reason:** ${this.reason}`)
            .addFields(
                { name: 'Target', value: `${this.member}\n${this.member.user.username}`, inline: true },
                { name: 'Officer', value: `<${this.officer}>\n${this.officer.user.username}`, inline: true },
                {
                    name: 'Expires',
                    value: `${this.expireAt.toDiscordString(TimeStyles.RelativeTime)}:\n ${this.expireAt.toDiscordString(TimeStyles.LongDateTime)}>`,
                    inline: true })

            .setColor(embedColor)
            .setThumbnail(this.member.avatarURL())
            .setFooter({ text: `ID: ${this.dbAnchor._id}` })
            .setTimestamp(timeUpdated ? this.updatedAt : this.createdAt);

    }
    constructor(client: Client, warningDoc:WarningRecord) {
        this.dbAnchor = warningDoc;
        this.guild = client.guilds.cache.get(warningDoc.guildId);
        this.member = this.guild.members.cache.get(warningDoc.targetId);
        this.officer = this.guild.members.cache.get(warningDoc.officerId);
        if (warningDoc.updaterId) this._updater = this.guild.members.cache.get(warningDoc.updaterId);
    }
}
