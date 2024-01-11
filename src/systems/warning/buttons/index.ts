import { ButtonInteraction } from 'discord.js';
import { removeWarning } from './remove-warn';
import { unban as unbanWarn } from './unban';
import { updateWarn } from './update-warn';
import { viewWarnings } from './view-warn';

// eslint-disable-next-line no-shadow
enum flags {
    remove = 'r',
    update = 'u',
    view = 'v',
    unban = 'n'
}

export async function warnButtons(interaction:ButtonInteraction) {
    const { client, customId } = interaction;
    switch (customId.split(client.splitCustomIDOn)[1]) {
    case flags.remove:
        await removeWarning(interaction);
        break;
    case flags.update:
        await updateWarn(interaction);
        break;
    case flags.view:
        await viewWarnings(interaction);
        break;
    case flags.unban:
        await unbanWarn(interaction);
        break;
    default:
        throw Error('[ERROR] Unkown warn button flag');
    }

}
