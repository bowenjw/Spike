import { ClientOptions, Locale } from 'discord.js';
import { LocalizedHelpInfo } from './types';

export interface ExtendedClientOptions extends ClientOptions {
	receiveMessageComponents?: boolean;
	receiveModals?: boolean;
	receiveAutocomplete?: boolean;
	replyOnError?: boolean;
	splitCustomID?: boolean;
	splitCustomIDOn?: string;
	useGuildCommands?: boolean;
}

export interface initOptions {
	commandPath?: string;
	contextMenuPath?: string;
	buttonPath?: string;
	selectMenuPath?: string;
	modalPath?: string;
	eventPath: string;
}

export interface HelpInfoProperties {
	/**
	 * Adds Localized tiles to object
	 * @param localizedTitle Localized titles
	 */
	setHelpTitleLocalizations(localizedTitle: LocalizedHelpInfo): this;

	/**
	 * Adds Localized descriptions to object
	 * @param localizedDescriptions Localized descriptions
	 */
	setHelpDescriptionLocalizations(localizedDescriptions: LocalizedHelpInfo): this;

	/**
	 * Gets the title and description for a locale
	 * @param locale the locale of which to get the title
	 */
	getHelpInfo(locale: Locale): { title: string; description: string };
}
