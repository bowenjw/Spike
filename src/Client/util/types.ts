import {
    ChatInputCommandInteraction,
    CommandInteraction,
    ContextMenuCommandInteraction,
    InteractionResponse,
    LocaleString,
    Message,
    SharedSlashCommandOptions,
} from 'discord.js';
import {
    Command, ExtendedContextMenuCommandBuilder, ExtendedSlashCommandBuilder,
} from '../Classes';

/**
 * Color values that can be referanced
 */
export declare const ExtraColor: {
	EmbedGray: 0x2b2d31;
	PVBlue: 0x2986cc;
	PVDarkBlue: 0x09223a;
	PVOrange: 0xe54c3c;
};

/**
 * posible command return types
 */
export type ChatInputCommandBuilders =
	| ExtendedSlashCommandBuilder
	| Omit<ExtendedSlashCommandBuilder, Exclude<keyof SharedSlashCommandOptions, 'options'>>
	| Omit<ExtendedSlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

/**
 * Posible interaction return types
 */
export type ReturnableInteraction = void | CommandInteraction | ContextMenuCommandInteraction | InteractionResponse | Message;

/**
 * TypeCommand definition
 */
export type TypeCommand = Command<ChatInputCommandBuilders | ExtendedContextMenuCommandBuilder, ChatInputCommandInteraction | ContextMenuCommandInteraction>;

/**
 * Discord time Style definition
 */
export type TimeStyle = 'd' | 'D' | 't' | 'T' | 'f' | 'F' | 'R';

/**
 * Discord TimeStyles
 */
export declare const TimeStyles: {
	ShortDate: 'd';
	LongDatez: 'D';
	ShortTime: 't';
	LongTime: 'T';
	ShortDateTime: 'f';
	LongDateTime: 'F';
	RelativeTime: 'R';
};

/**
 * LocilzationHelpInfo type
 */
export type LocalizedHelpInfo = Partial<Record<LocaleString, string>>;
