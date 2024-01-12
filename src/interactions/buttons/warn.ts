import { ButtonInteraction } from 'discord.js';
import { Interaction } from '../../Client';
import { warnButtons } from '../../systems/warning';

export default new Interaction<ButtonInteraction>()
    .setName('warn')
    .setExecute(warnButtons);
