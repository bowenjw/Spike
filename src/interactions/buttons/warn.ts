import { ButtonInteraction } from 'discord.js';
import { Interaction } from '../../Client';

export default new Interaction<ButtonInteraction>()
    .setName('warn')
    .setExecute();
