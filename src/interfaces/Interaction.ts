import { AnySelectMenuInteraction, ButtonInteraction, ChannelSelectMenuInteraction, Interaction as dInteraction, MentionableSelectMenuInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from 'discord.js';
import ExtendedClient from '../classes/ExtendedClient';

export interface Interaction {
    name: string;
    execute(client: ExtendedClient, interaction: dInteraction): void;
}

export interface Button extends Interaction {
    execute(client: ExtendedClient, interaction: ButtonInteraction): void
}

export interface ModalSubmit extends Interaction {
    execute(client: ExtendedClient, interaction: ModalSubmitInteraction): void
}

export interface AnySelectMenu extends Interaction {
    execute(client: ExtendedClient, interaction: AnySelectMenuInteraction): void
}

export interface StringSelectMenu extends AnySelectMenu {
    execute(client: ExtendedClient, interaction: StringSelectMenuInteraction): void
}

export interface MentionableSelectMenu extends AnySelectMenu {
    execute(client: ExtendedClient, interaction: MentionableSelectMenuInteraction): void
}

export interface ChannelSelectMenu extends AnySelectMenu {
    execute(client: ExtendedClient, interaction: ChannelSelectMenuInteraction): void
}

export interface RoleSelectMenu extends AnySelectMenu {
    execute(client: ExtendedClient, interaction: RoleSelectMenuInteraction): void
}

export interface UserSelectMenu extends AnySelectMenu {
    execute(client: ExtendedClient, interaction: UserSelectMenuInteraction): void
}